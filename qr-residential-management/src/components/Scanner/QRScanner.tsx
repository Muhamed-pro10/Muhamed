import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  CameraOff, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  KeyboardIcon,
  RefreshCw
} from 'lucide-react';
import { validateQRCodeData } from '../../utils/qrCode';
import { getResidentById, createAccessLog } from '../../utils/dataService';
import { Resident } from '../../types';

const QRScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null);
  const [scannedResident, setScannedResident] = useState<Resident | null>(null);
  const [accessType, setAccessType] = useState<'entry' | 'exit'>('entry');
  const [manualEntry, setManualEntry] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [error, setError] = useState('');
  const [recentScans, setRecentScans] = useState<Array<{
    resident: Resident;
    timestamp: Date;
    accessType: 'entry' | 'exit';
  }>>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
        
        // Start scanning for QR codes
        scanForQRCode();
      }
    } catch (err) {
      setError('Camera access denied. Please enable camera permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const scanForQRCode = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);

      // In a real implementation, you would use a QR code scanning library here
      // For demo purposes, we'll simulate QR code detection
      // You could integrate with libraries like jsQR or qr-scanner
      // const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      setTimeout(() => {
        if (isScanning) {
          scanForQRCode();
        }
      }, 100);
    } else {
      setTimeout(() => {
        if (isScanning) {
          scanForQRCode();
        }
      }, 100);
    }
  };

  const processQRCode = (qrData: string) => {
    try {
      setError('');
      const parsedData = validateQRCodeData(qrData);
      
      if (!parsedData) {
        setScanResult('error');
        setError('Invalid or expired QR code');
        return;
      }

      const resident = getResidentById(parsedData.residentId);
      
      if (!resident) {
        setScanResult('error');
        setError('Resident not found');
        return;
      }

      if (!resident.isActive) {
        setScanResult('error');
        setError('Resident account is inactive');
        return;
      }

      // Create access log
      createAccessLog({
        residentId: resident.id,
        residentName: `${resident.firstName} ${resident.lastName}`,
        unitNumber: resident.unitNumber,
        timestamp: new Date(),
        accessType,
        method: 'qr_code',
        location: 'Main Gate',
        securityPersonnel: 'Current User',
      });

      setScannedResident(resident);
      setScanResult('success');
      
      // Add to recent scans
      setRecentScans(prev => [{
        resident,
        timestamp: new Date(),
        accessType,
      }, ...prev.slice(0, 4)]);

      // Reset after 3 seconds
      setTimeout(() => {
        setScanResult(null);
        setScannedResident(null);
      }, 3000);

    } catch (err) {
      console.error('QR processing error:', err);
      setScanResult('error');
      setError('Failed to process QR code');
    }
  };

  const handleManualEntry = () => {
    if (!manualEntry.trim()) {
      setError('Please enter QR code data');
      return;
    }
    
    processQRCode(manualEntry);
    setManualEntry('');
    setShowManualInput(false);
  };

  const simulateQRScan = () => {
    // For demo purposes - simulate scanning a valid QR code
    const mockQRData = JSON.stringify({
      residentId: '1',
      unitNumber: 'A-101',
      timestamp: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    processQRCode(mockQRData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">QR Code Scanner</h1>
        <p className="text-gray-600">Scan resident QR codes for compound access</p>
      </div>

      {/* Access Type Selection */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Access Type</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setAccessType('entry')}
            className={`btn ${accessType === 'entry' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Entry
          </button>
          <button
            onClick={() => setAccessType('exit')}
            className={`btn ${accessType === 'exit' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Exit
          </button>
        </div>
      </div>

      {/* Scanner Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Scanner */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Camera Scanner</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowManualInput(!showManualInput)}
                className="btn btn-secondary"
                title="Manual Entry"
              >
                <KeyboardIcon className="h-4 w-4" />
              </button>
              <button
                onClick={simulateQRScan}
                className="btn btn-secondary"
                title="Demo Scan"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Scanner Area */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
            {isScanning ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                
                {/* Scanning Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-white border-dashed rounded-lg w-48 h-48 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Camera className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Position QR code in frame</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <CameraOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Camera not active</p>
                  <button
                    onClick={startScanner}
                    className="btn btn-primary"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Start Scanner
                  </button>
                </div>
              </div>
            )}

            {/* Result Overlay */}
            {scanResult && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                  {scanResult === 'success' && scannedResident ? (
                    <div className="text-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Granted</h3>
                      <p className="text-gray-600 mb-1">{scannedResident.firstName} {scannedResident.lastName}</p>
                      <p className="text-sm text-gray-500">Unit {scannedResident.unitNumber}</p>
                      <p className="text-sm text-gray-500 capitalize mt-2">{accessType} • {new Date().toLocaleTimeString()}</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Scanner Controls */}
          <div className="mt-4 flex justify-center space-x-4">
            {isScanning ? (
              <button onClick={stopScanner} className="btn btn-secondary">
                <CameraOff className="h-4 w-4 mr-2" />
                Stop Scanner
              </button>
            ) : (
              <button onClick={startScanner} className="btn btn-primary">
                <Camera className="h-4 w-4 mr-2" />
                Start Scanner
              </button>
            )}
          </div>

          {/* Manual Input */}
          {showManualInput && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Manual QR Code Entry</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Paste QR code data..."
                  className="input flex-1"
                  value={manualEntry}
                  onChange={(e) => setManualEntry(e.target.value)}
                />
                <button onClick={handleManualEntry} className="btn btn-primary">
                  Process
                </button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Scans</h2>
          
          {recentScans.length > 0 ? (
            <div className="space-y-3">
              {recentScans.map((scan, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium text-sm">
                        {scan.resident.firstName[0]}{scan.resident.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {scan.resident.firstName} {scan.resident.lastName}
                      </p>
                      <p className="text-xs text-gray-500">Unit {scan.resident.unitNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      scan.accessType === 'entry' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {scan.accessType}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {scan.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent scans</p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Today's Activity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">0</p>
                <p className="text-xs text-gray-500">Entries</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">0</p>
                <p className="text-xs text-gray-500">Exits</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Select Access Type</h3>
            <p className="text-sm text-gray-600">Choose whether the resident is entering or exiting</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">2</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Start Scanner</h3>
            <p className="text-sm text-gray-600">Activate the camera and position QR code in frame</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">3</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Verify Access</h3>
            <p className="text-sm text-gray-600">Review the scan result and grant or deny access</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;