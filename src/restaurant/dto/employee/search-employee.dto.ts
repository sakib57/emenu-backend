import { SearchQueryDTO } from '../../../common/dto';

export class SearchEmployeeDTO
  extends SearchQueryDTO
  implements Readonly<SearchEmployeeDTO> {}
