import { SearchQueryDTO } from '../../common/dto';

export class SearchMenuDTO
  extends SearchQueryDTO
  implements Readonly<SearchMenuDTO> {}
