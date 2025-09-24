import { Test, TestingModule } from '@nestjs/testing';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';

describe('SupportController', () => {
    let controller: SupportController;
    let service: SupportService;

    const mockSupportService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SupportController],
            providers: [
                {
                    provide: SupportService,
                    useValue: mockSupportService,
                },
            ],
        }).compile();

        controller = module.get<SupportController>(SupportController);
        service = module.get<SupportService>(SupportService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create a support entry', async () => {
        const createSupportDto = {
            question: 'How to reset password?',
            answer: 'Click on forgot password link and follow the instructions.',
        };
        const expectedResult = {
            id: '1',
            ...createSupportDto,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockSupportService.create.mockResolvedValue(expectedResult);

        const result = await controller.create(createSupportDto);
        expect(result).toEqual(expectedResult);
        expect(service.create).toHaveBeenCalledWith(createSupportDto);
    });

    it('should return all support entries', async () => {
        const expectedResult = [
            {
                id: '1',
                question: 'Test question',
                answer: 'Test answer',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        mockSupportService.findAll.mockResolvedValue(expectedResult);

        const result = await controller.findAll();
        expect(result).toEqual(expectedResult);
        expect(service.findAll).toHaveBeenCalled();
    });
});
