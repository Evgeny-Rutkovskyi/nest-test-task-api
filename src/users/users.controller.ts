import { Controller, Get, Patch, Post, Param, Body, Query, Req, UseGuards, UsePipes, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminGuard } from 'src/guards/admin.guard';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { updateUserSchema, UpdateUserZodDto } from './dto/updateUserZod.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlockUserDto, UpdateUserDto, UserResponseDto } from './dto/swaggerDto.types';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly userService: UsersService) {}
  
    
    @Post('/create/admin/:id')
    @ApiOperation({ summary: 'Promote user to admin' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async createAdmin(@Param('id', ParseIntPipe) id: number) {
        return await this.userService.createAdmin(id);
    }
        
    @Get('/:id')
    @ApiOperation({ summary: 'Get user by id' })
    @ApiResponse({ status: 200, type: UserResponseDto })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getUser(@Param('id', ParseIntPipe) id: number) {
        return await this.userService.getUserById(id);
    }

    @Get('/all')
    @ApiOperation({ summary: 'Get all users with optional filters' })
    @ApiQuery({ name: 'name', required: false, example: 'John' })
    @ApiQuery({ name: 'isBlock', required: false, example: 'true' })
    @ApiResponse({ status: 200, type: [UserResponseDto] })
    async getAllUsers(@Query('name') name?: string, @Query('isBlock') isBlock?: string) {
        return await this.userService.getAllUsers({
            name,
            isBlock: isBlock === 'true' ? true : isBlock === 'false' ? false : undefined,
        });
    }

    @Patch('/update')
    @ApiOperation({ summary: 'Update user (self or admin)' })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, type: UserResponseDto })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @UsePipes(new ZodValidationPipe(updateUserSchema))
    async updateUser(@Req() req, @Body() dto: UpdateUserZodDto) {
        return await this.userService.updateUser(req.user, dto);
    }

    @Post('block')
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'Block user (admin only)' })
    @ApiBody({ type: BlockUserDto })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async blockUser(@Body() body: { id: number }) {
        return await this.userService.blockUser(body.id);
    }

    @Post('/unblock')
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'Unblock user (admin only)' })
    @ApiBody({ type: BlockUserDto })
    @ApiResponse({ status: 200, type: UserResponseDto })
    async unblockUser(@Body() body: { id: number }) {
        return await this.userService.unblockUser(body.id);
    }
}
