import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from '../claims/claims.entity';
import { User } from '../users/users.entity';
import { Policy } from '../policies/policies.entity';

@Injectable()
export class ClaimService {
  constructor(
    @InjectRepository(Claim)
    private claimRepository: Repository<Claim>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
  ) {}

  // Create a new claim
  async createClaim(user_id: number, policy_id: number, claim_type: string, amount_requested: number, status: 'pending' | 'approved' | 'rejected', documents: any): Promise<Claim> {
    const user = await this.userRepository.findOne({ where: { user_id } });
    const policy = await this.policyRepository.findOne({ where: { policy_id } });

    if (!user || !policy) {
      throw new Error('User or Policy not found');
    }

    const claim = this.claimRepository.create({
      user,
      policy,
      claim_type,
      amount_requested,
      status,
      documents,
    });

    return this.claimRepository.save(claim);
  }

  // Fetch all claims for a specific user
  async getClaimsByUser(user_id: number): Promise<Claim[]> {
    return this.claimRepository.find({ where: { user: { user_id } } });
  }

  // Fetch all claims with filter options
  async getAllClaims(status?: 'pending' | 'approved' | 'rejected', claim_type?: string): Promise<Claim[]> {
    const query = this.claimRepository.createQueryBuilder('claim');

    if (status) {
      query.andWhere('claim.status = :status', { status });
    }

    if (claim_type) {
      query.andWhere('claim.claim_type = :claim_type', { claim_type });
    }

    return query.getMany();
  }

  // Fetch detailed information about a specific claim
  async getClaimById(claimId: number): Promise<Claim> {
    return this.claimRepository.findOne({
      where: { claim_id: claimId }, // Use 'where' for findOne
      relations: ['user', 'policy'], // Include the related entities
    });
  }

  // Update the status of a claim
  async updateClaimStatus(claimId: number, status: 'pending' | 'approved' | 'rejected'): Promise<Claim> {
    const claim = await this.claimRepository.findOne({
      where: { claim_id: claimId }, // Use 'where' for findOne
    });

    if (!claim) {
      throw new Error('Claim not found');
    }

    claim.status = status;

    return this.claimRepository.save(claim);
  }
}
