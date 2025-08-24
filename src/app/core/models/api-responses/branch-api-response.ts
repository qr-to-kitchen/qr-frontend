import {BranchDto} from '../branch.dto';

export interface BranchApiResponse {
  branch: BranchDto;
  branches: BranchDto[];
}
