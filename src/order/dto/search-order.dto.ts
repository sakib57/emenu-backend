import { SearchQueryDTO } from '../../common/dto';

export class SearchOrderDTO
  extends SearchQueryDTO
  implements Readonly<SearchOrderDTO> {}
