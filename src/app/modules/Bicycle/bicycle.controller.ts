import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { BicycleService } from './bicycle.service';
import sendResponse from '../../utils/sendResponse';
import { tokenDecoder } from '../Auth/auth.utils';

const createBicycle = catchAsync(async (req, res) => {
  const decoded = tokenDecoder(req);
  const { userId } = decoded;
  const bicycle = req.body;
  const dataToStore = { ...bicycle, author: userId };
  const result = await BicycleService.createBicycleIntoDb(dataToStore);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Bicycle is created successfully',
    data: result,
  });
});

const getAllBiCycles = catchAsync(async (req, res) => {
  const bicycles = await BicycleService.getAllBiCycle(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Bicycles retrieved successfully',
    data: bicycles,
  });
});

const getSingleBiCycleById = catchAsync(async (req, res) => {
  const bicycle = await BicycleService.getSingleBiCycleById(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Bicycle retrieved successfully',
    data: bicycle,
  });
});

const getSingleBiCycleBySlug = catchAsync(async (req, res) => {
  const bicycle = await BicycleService.getSingleBiCycleBySlug(req.params.slug);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Bicycle retrieved successfully',
    data: bicycle,
  });
});

const updateSingleBiCycleById = catchAsync(async (req, res) => {
  const updatedBicycle = await BicycleService.updateSingleBiCycleById(
    req?.params?.id,
    req?.body,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Bicycle updated successfully',
    data: updatedBicycle,
  });
});

const deleteSingleBiCycleById = catchAsync(async (req, res) => {
  await BicycleService.deleteSingleBiCycleById(req?.params?.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Bicycle deleted successfully',
    data: null,
  });
});

export const bicycleController = {
  createBicycle,
  getAllBiCycles,
  getSingleBiCycleById,
  updateSingleBiCycleById,
  deleteSingleBiCycleById,
  getSingleBiCycleBySlug,
};
