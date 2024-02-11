import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('common-search')
export class SearchController {
  constructor(private searchService: SearchService) {}
  @UseGuards(AuthGuard)
  @Get()
  async commonSearch(
    @Query('searchString') searchString: string,
    @Request() req: any,
  ) {
    return await this.searchService.commonSearch(searchString, req.user.userId);
  }
}
