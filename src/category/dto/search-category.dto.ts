import { SearchQueryDTO } from '../../common/dto';

export class SearchCategoryDTO
  extends SearchQueryDTO
  implements Readonly<SearchCategoryDTO> {}
