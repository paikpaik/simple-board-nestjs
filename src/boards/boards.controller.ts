import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { Board } from './board.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
  private logger = new Logger('Boards')
  constructor(private boardsService: BoardsService) {}

  // 전체 게시물 조회
  @Get()
  getAllBoard(
    @GetUser() user: User
  ): Promise<Board[]> {
    this.logger.verbose(`User ${user.username} trying to get all boards`)
    return this.boardsService.getAllBoards(user);
  }

  // 게시물 생성
  @Post()
  @UsePipes(ValidationPipe)
  createBoard(@Body() createBoardDto: CreateBoardDto,
  @GetUser() user: User): Promise<Board> {
    this.logger.verbose(`User ${user.username} creating a new board. Payload: ${JSON.stringify(createBoardDto)}`)
    return this.boardsService.createBoard(createBoardDto, user)
  }

  // id로 게시물 조회
  @Get('/:id')
  getBoardById(@Param('id') id: number): Promise<Board> {
    return this.boardsService.getBoardById(id)
  }

  // id로 게시물 삭제
  @Delete('/:id')
  deleteBoard(@Param('id', ParseIntPipe) id,
  @GetUser() user: User
  ): Promise<void> {
    return this.boardsService.deleteBoard(id, user);
  }

  // id로 게시물 상태 변경 (public or private)
  @Patch('/:id/status')
  updateBoardStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus
  ) {
    return this.boardsService.updateBoardStatus(id, status);
  }

}
