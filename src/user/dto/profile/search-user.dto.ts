import { SearchQueryDTO } from '../../../common/dto';

export class SearchUserDTO
  extends SearchQueryDTO
  implements Readonly<SearchUserDTO> {}
