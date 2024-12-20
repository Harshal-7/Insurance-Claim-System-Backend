import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Policy } from 'src/policies/policies.entity';
import { User } from 'src/users/users.entity';
import { Claim, ClaimStatus } from './claims.entity';
import { CreateClaimDto, UpdateClaimDto } from './dto/claim.dto';

@Injectable()
export class ClaimsService {
  constructor(
    @InjectRepository(Claim)
    private readonly claimRepository: Repository<Claim>,
    @InjectRepository(Policy)
    private readonly policyRepository: Repository<Policy>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findClaimsByUserId(userId: number): Promise<Claim[]> {
    return this.claimRepository.find({
      where: { user: { user_id: userId } },
      relations: ['policy', 'user'],
    });
  }

  async findClaims(filter: {
    status?: ClaimStatus;
    claimType?: string;
  }): Promise<Claim[]> {
    const query = this.claimRepository.createQueryBuilder('claim');

    if (filter.status) {
      query.andWhere('claim.status = :status', { status: filter.status });
    }

    if (filter.claimType) {
      query.andWhere('claim.claim_type = :claimType', {
        claimType: filter.claimType,
      });
    }

    return query.getMany();
  }

  async createClaim(createClaimDto: CreateClaimDto): Promise<Claim> {
    const { userId, policyId, claimType, amountRequested, documents } =
      createClaimDto;

    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    const policy = await this.policyRepository.findOne({
      where: { policy_id: policyId },
    });

    if (!user || !policy) {
      console.log('ERROR : ');

      throw new Error('User or Policy not found');
    }

    console.log('USER : ', user);
    console.log('policy : ', policy);

    const claim = this.claimRepository.create({
      user,
      policy,
      claim_type: claimType,
      amount_requested: amountRequested,
      status: ClaimStatus.PENDING,
      submission_date: new Date(),
      documents,
    });

    console.log('claim : ', claim);

    return this.claimRepository.save(claim);
  }

  async updateClaimStatus(
    claimId: number,
    updateClaimDto: UpdateClaimDto,
  ): Promise<Claim> {
    const claim = await this.claimRepository.findOne({
      where: { claim_id: claimId },
    });

    if (!claim) {
      throw new Error('Claim not found');
    }

    claim.status = updateClaimDto.status;

    return this.claimRepository.save(claim);
  }

  async findClaimById(claimId: number): Promise<Claim> {
    return this.claimRepository.findOne({
      where: { claim_id: claimId },
      relations: ['policy', 'user'],
    });
  }
}
