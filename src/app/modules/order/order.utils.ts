/* eslint-disable @typescript-eslint/no-explicit-any */
import Shurjopay, { PaymentResponse, VerificationResponse } from 'shurjopay';
import config from '../../config';

const shurjopay = new Shurjopay();

shurjopay.config(
  config.sp_endpoint!, // Set endpoint
  config.sp_username!, // Set username
  config.sp_password!, // Set password
  config.sp_prefix!, // Set prefix
  config.sp_return_url!, // Set return URL
);

// Make payment asynchronously
const makePaymentAsync = async (
  paymentPayload: any,
): Promise<PaymentResponse> => {
  try {
    // Wait for the payment response and return it
    return new Promise((resolve, reject) => {
      shurjopay.makePayment(
        paymentPayload,
        (response) => resolve(response),
        (error) => reject(error),
      );
    });
  } catch (error) {
    console.error('Error making payment:', error);
    throw error; // Re-throw error to be handled at the calling point
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
    throw error; // Re-throw error to be handled at the calling point
  }
};

export const orderUtils = {
  makePaymentAsync,
  verifyPaymentAsync,
};
