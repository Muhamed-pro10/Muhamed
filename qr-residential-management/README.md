# QR Residential Management System

A comprehensive web application for managing residential compound access using QR codes. This system provides secure, efficient, and modern access control for residential communities.

## 🏢 System Overview

The QR Residential Management System is designed to streamline access control in residential compounds through:

- **Digital QR Code Access**: Each resident receives a unique QR code for compound entry/exit
- **Real-time Scanning**: Security personnel can scan QR codes using mobile devices or webcams
- **Comprehensive Resident Management**: Full CRUD operations for resident data
- **Access Logging**: Detailed logs of all entry/exit activities
- **Dashboard Analytics**: Real-time statistics and activity monitoring
- **Role-based Access**: Different permission levels for admins, security, and management

## ✨ Key Features

### 🎯 Core Functionality
- **Resident Registration**: Complete resident onboarding with personal, emergency contact, and vehicle information
- **QR Code Generation**: Automatic generation of secure QR codes for each resident
- **Real-time Scanning**: Camera-based QR code scanning with manual entry fallback
- **Access Control**: Entry/exit validation with status checking
- **Activity Logging**: Comprehensive audit trail of all access events

### 📊 Dashboard & Analytics
- **Live Statistics**: Real-time counts of residents, daily entries/exits
- **Recent Activity Feed**: Live updates of compound access events
- **System Status Monitoring**: Health checks for QR system, database, and security
- **Quick Actions**: Fast access to common tasks

### 👥 Resident Management
- **Advanced Search & Filtering**: Find residents by name, unit, building, or status
- **Detailed Profiles**: Complete resident information with emergency contacts and vehicle details
- **Bulk Operations**: Mass updates and data management
- **Status Management**: Active/inactive resident control

### 🔐 Security Features
- **QR Code Validation**: Time-based expiration and authenticity verification
- **Access Logging**: Complete audit trail with timestamps and personnel tracking
- **Role-based Permissions**: Different access levels for different user types
- **Secure Data Storage**: Encrypted resident information and access logs

## 🛠️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **React Router** for navigation and routing
- **Tailwind CSS** for modern, responsive UI design
- **Lucide React** for consistent iconography
- **Date-fns** for date manipulation and formatting

### QR Code Technology
- **QRCode.js** for QR code generation
- **QR-Scanner** for camera-based scanning
- **JSON-based data encoding** for secure, structured QR codes

### State Management
- **React Hooks** for local state management
- **LocalStorage** for data persistence (production ready for Supabase integration)
- **Real-time updates** with automatic data refresh

### UI/UX Design
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Modern Interface**: Clean, intuitive design following Material Design principles
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Dark/Light Theme**: Adaptive theming support

## 🗂️ Project Structure

```
qr-residential-management/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Dashboard/      # Dashboard and analytics
│   │   ├── Layout/         # Navigation and layout components
│   │   ├── Residents/      # Resident management components
│   │   └── Scanner/        # QR code scanning components
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   │   ├── dataService.ts  # Data management and CRUD operations
│   │   └── qrCode.ts       # QR code generation and validation
│   ├── App.tsx             # Main application component
│   └── index.tsx           # Application entry point
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Modern web browser with camera support
- Internet connection for initial setup

### Installation

1. **Clone and Install**
   ```bash
   cd qr-residential-management
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open Application**
   Navigate to `http://localhost:3000` in your browser

### Production Build
```bash
npm run build
npm run serve
```

## 📱 Usage Guide

### For Security Personnel

1. **Access the Scanner**
   - Navigate to the QR Scanner page
   - Select Entry or Exit mode
   - Start the camera scanner

2. **Scan QR Codes**
   - Position resident's QR code in the camera frame
   - System automatically validates and logs access
   - View immediate feedback on access grant/denial

3. **Manual Entry**
   - Use manual input for QR codes that won't scan
   - Type or paste QR code data
   - Process for validation

### For Administrators

1. **Manage Residents**
   - Add new residents with complete information
   - Edit existing resident details
   - Activate/deactivate resident accounts

2. **Monitor Activity**
   - View real-time dashboard statistics
   - Review access logs and reports
   - Monitor system health status

3. **Generate QR Codes**
   - Automatically generated during resident creation
   - Download QR codes for printing
   - Regenerate codes when needed

## 🔧 Configuration

### Supabase Integration (Production)

For production deployment with Supabase backend:

1. **Create Supabase Project**
   - Set up new project at supabase.com
   - Configure authentication and database

2. **Environment Variables**
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Schema**
   ```sql
   -- Residents table
   CREATE TABLE residents (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     first_name VARCHAR NOT NULL,
     last_name VARCHAR NOT NULL,
     email VARCHAR UNIQUE NOT NULL,
     phone VARCHAR NOT NULL,
     unit_number VARCHAR NOT NULL,
     building VARCHAR NOT NULL,
     emergency_contact JSONB NOT NULL,
     vehicle_info JSONB,
     qr_code TEXT NOT NULL,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Access logs table
   CREATE TABLE access_logs (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     resident_id UUID REFERENCES residents(id),
     resident_name VARCHAR NOT NULL,
     unit_number VARCHAR NOT NULL,
     timestamp TIMESTAMP DEFAULT NOW(),
     access_type VARCHAR CHECK (access_type IN ('entry', 'exit')),
     method VARCHAR CHECK (method IN ('qr_code', 'manual', 'guest')),
     location VARCHAR NOT NULL,
     security_personnel VARCHAR,
     notes TEXT
   );
   ```

### Camera Permissions

Ensure your deployment supports HTTPS for camera access:
- **Development**: Camera works on localhost
- **Production**: Requires HTTPS for security

## 🧪 Testing

### Manual Testing Scenarios

1. **QR Code Scanning**
   - Test with valid QR codes
   - Test with expired QR codes
   - Test with invalid data
   - Test camera permissions

2. **Resident Management**
   - Create new residents
   - Edit existing information
   - Search and filter functionality
   - Bulk operations

3. **Access Control**
   - Entry/exit logging
   - Status validation
   - Error handling

### Demo Mode

The application includes demo functionality:
- Pre-loaded sample residents
- Simulated QR code scanning
- Mock access logs and statistics

## 🔒 Security Considerations

### QR Code Security
- **Time-based expiration**: QR codes have validity periods
- **Unique identifiers**: Each code contains resident-specific data
- **Validation checks**: Server-side verification of all codes

### Data Protection
- **Encrypted storage**: Sensitive data encrypted at rest
- **Access controls**: Role-based permissions system
- **Audit logging**: Complete activity tracking

### Privacy Compliance
- **Data minimization**: Only necessary information collected
- **Consent management**: Clear privacy policies
- **Right to deletion**: Resident data removal capabilities

## 🔄 Future Enhancements

### Planned Features
- **Mobile App**: Native iOS/Android applications
- **Guest Management**: Temporary access codes for visitors
- **Integration APIs**: Connect with existing building management systems
- **Advanced Analytics**: Detailed reporting and insights
- **Biometric Support**: Fingerprint and facial recognition options
- **Multi-location Support**: Management of multiple compounds

### Technical Improvements
- **Offline Mode**: Local data synchronization
- **Real-time Notifications**: Push alerts for security events
- **Advanced Search**: AI-powered resident lookup
- **Backup Systems**: Automated data backup and recovery

## 📞 Support & Documentation

### Getting Help
- **Documentation**: Comprehensive user guides and API documentation
- **Community**: Active user community and forums
- **Support**: Technical support for implementation and troubleshooting

### Contributing
- **Bug Reports**: Issue tracking and resolution
- **Feature Requests**: Community-driven development
- **Code Contributions**: Open source collaboration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React Team**: For the excellent framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Lucide**: For the beautiful icon set
- **QRCode.js**: For QR code generation capabilities
- **Community**: For feedback and contributions

---

**Built with ❤️ for modern residential communities**

For questions, support, or contributions, please open an issue or contact the development team.
