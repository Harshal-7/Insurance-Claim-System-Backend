// import { Controller } from '@nestjs/common';

// @Controller('claims')
// export class ClaimsController {}

import {
    Controller,
    Get,
    Post,
    Put,
    Query,
    Param,
    Body,
    NotFoundException,
  } from '@nestjs/common';
  import { ClaimsService } from './claims.service';
  import { Claim } from './claims.entity';
  
  @Controller('claims')
  export class ClaimsController {
    constructor(private readonly claimsService: ClaimsService) {}
  
    // Submit a new claim (Policyholder API)
    @Post()
    async create(@Body() claimData: Partial<Claim>): Promise<Claim> {
      return this.claimsService.create(claimData);
    }
  
    // Fetch all claims with optional filters (Administrator API)
    @Get()
    async findAll(
      @Query('status') status?: string,
      @Query('type') type?: string,
      @Query('date') date?: string,
    ): Promise<Claim[]> {
      const filters = { status, type, date };
      return this.claimsService.findAll(filters);
    }
  
    // Fetch detailed information about a specific claim (Administrator API)
    @Get(':claimId')
    async findOne(@Param('claimId') claimId: number): Promise<Claim> {
      return this.claimsService.findOne(claimId);
    }
  
    // Fetch all claims submitted by a specific user (Policyholder API)
    @Get('/user/:userId')
    async findByUser(@Param('userId') userId: number): Promise<Claim[]> {
      return this.claimsService.findByUser(userId);
    }
  
    // Update the status of a claim (Administrator API)
    @Put(':claimId/status')
    async updateStatus(
      @Param('claimId') claimId: number,
      @Body() updateData: { status: 'approved' | 'rejected'; comments?: string },
    ): Promise<Claim> {
      return this.claimsService.updateStatus(claimId, updateData.status, updateData.comments);
    }
  
    // Generate reports based on claims data (Administrator API)
    @Get('/reports')
    async generateReports(@Query('groupBy') groupBy: string): Promise<any> {
      if (!['status', 'claim_type', 'submission_date'].includes(groupBy)) {
        throw new NotFoundException('Invalid groupBy parameter.');
      }
      return this.claimsService.generateReports(groupBy);
    }
  }