import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Policy } from './policies.entity';
import { PolicyResponseDto } from './dto/policy.dto';

@Injectable()
export class PoliciesService {
  constructor(
    @InjectRepository(Policy)
    private policyRepository: Repository<Policy>,
  ) {}

  async findActivePolicies(userId: number): Promise<Policy[]> {
    return await this.policyRepository.find({
      where: {
        user: { user_id: userId },
      },
    });
  }
}
