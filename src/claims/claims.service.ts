import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Claim } from './claims.entity';

@Injectable()
export class ClaimsService {
  constructor(
    @InjectRepository(Claim)
    private readonly claimRepository: Repository<Claim>,
  ) {}

  async create(claim: Partial<Claim>): Promise<Claim> {
    const newClaim = this.claimRepository.create(claim);
    return await this.claimRepository.save(newClaim);
  }

  async findAll(): Promise<Claim[]> {
    return await this.claimRepository.find({ relations: ['policy', 'user'] });
  }

  async findOne(claimId: number): Promise<Claim> {
    const claim = await this.claimRepository.findOne({
      where: { claim_id: claimId },
      relations: ['policy', 'user'],
    });
    if (!claim) {
      throw new NotFoundException(`Claim with ID ${claimId} not found.`);
    }
    return claim;
  }

  async update(claimId: number, updates: Partial<Claim>): Promise<Claim> {
    const claim = await this.findOne(claimId);
    Object.assign(claim, updates);
    return await this.claimRepository.save(claim);
  }

  async delete(claimId: number): Promise<void> {
    const result = await this.claimRepository.delete(claimId);
    if (result.affected === 0) {
      throw new NotFoundException(`Claim with ID ${claimId} not found.`);
    }
  }
}
