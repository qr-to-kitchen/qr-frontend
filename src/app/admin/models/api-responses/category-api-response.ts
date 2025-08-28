import {CategoryDto} from '../category.dto';

export interface CategoryApiResponse {
  category: CategoryDto;
  categories: CategoryDto[];
}
