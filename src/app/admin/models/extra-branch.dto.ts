import {BranchDto} from '../../core/models/branch.dto';
import {ExtraDto} from './extra.dto';

export interface ExtraBranchDto {
  id: number;
  branch: BranchDto;
  extra: ExtraDto;

  changed: boolean;
  branchId: number;
  extraId: number;
}
