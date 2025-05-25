/* eslint-disable @typescript-eslint/no-explicit-any */
import Shurjopay, { PaymentResponse, VerificationResponse } from 'shurjopay';
import config from '../../config';



const shurjopay = new Shurjopay();

shurjopay.config(
  config.sp_endpoint!,
  config.sp_username!,
  config.sp_password!,
  config.sp_prefix!,
  config.sp_return_url!,
);

// Make payment asynchronously
const makePaymentAsync = async (
  paymentPayload: any,
): Promise<PaymentResponse> => {
  try {
    return new Promise((resolve, reject) => {
      shurjopay.makePayment(
        paymentPayload,
        (response) => resolve(response),
        (error) => reject(error),
      );
    });
  } catch (error) {
    console.error('Error making payment:', error);
    throw error;
  }
};

// Verify payment asynchronously
const verifyPaymentAsync = async (
  order_id: string,
): Promise<VerificationResponse[]> => {
  try {
    return new Promise((resolve, reject) => {
      shurjopay.verifyPayment(
        order_id,
        (response) => resolve(response),
        (error) => reject(error),
      );
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};



export const paymentUtils = {
  makePaymentAsync,
  verifyPaymentAsync,
};
