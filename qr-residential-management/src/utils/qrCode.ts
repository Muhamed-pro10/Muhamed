import QRCode from 'qrcode';
import { QRCodeData, Resident } from '../types';

export const generateQRCodeData = (resident: Resident): QRCodeData => {
  return {
    residentId: resident.id,
    unitNumber: resident.unitNumber,
    timestamp: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Valid for 30 days
  };
};

export const generateQRCodeImage = async (data: QRCodeData): Promise<string> => {
  try {
    const qrString = JSON.stringify(data);
    const qrCodeDataURL = await QRCode.toDataURL(qrString, {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const validateQRCodeData = (qrData: string): QRCodeData | null => {
  try {
    const parsed: QRCodeData = JSON.parse(qrData);
    
    // Validate required fields
    if (!parsed.residentId || !parsed.unitNumber || !parsed.timestamp) {
      return null;
    }

    // Check if QR code is expired
    if (parsed.validUntil && new Date(parsed.validUntil) < new Date()) {
      return null;
    }

    return {
      ...parsed,
      timestamp: new Date(parsed.timestamp),
      validUntil: parsed.validUntil ? new Date(parsed.validUntil) : undefined,
    };
  } catch (error) {
    console.error('Invalid QR code data:', error);
    return null;
  }
};

export const generateResidentQRCode = async (resident: Resident): Promise<string> => {
  const qrData = generateQRCodeData(resident);
  return await generateQRCodeImage(qrData);
};