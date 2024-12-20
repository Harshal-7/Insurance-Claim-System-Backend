import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Policy } from './policies.entity';

@Injectable()
export class PoliciesService {
  constructor(
    @InjectRepository(Policy)
    private readonly policyRepository: Repository<Policy>,
  ) {}

  async create(policy: Partial<Policy>): Promise<Policy> {
    const newPolicy = this.policyRepository.create(policy);
    return await this.policyRepository.save(newPolicy);
  }

  async findAll(): Promise<Policy[]> {
    return await this.policyRepository.find({ relations: ['user'] });
  }

  async findOne(policyId: number): Promise<Policy> {
    const policy = await this.policyRepository.findOne({
      where: { policy_id: policyId },
      relations: ['user'],
    });
    if (!policy) {
      throw new NotFoundException(`Policy with ID ${policyId} not found.`);
    }
    return policy;
  }

  async update(policyId: number, updates: Partial<Policy>): Promise<Policy> {
    const policy = await this.findOne(policyId);
    Object.assign(policy, updates);
    return await this.policyRepository.save(policy);
  }

  async delete(policyId: number): Promise<void> {
    const result = await this.policyRepository.delete(policyId);
    if (result.affected === 0) {
      throw new NotFoundException(`Policy with ID ${policyId} not found.`);
    }
  }
}
