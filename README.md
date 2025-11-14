ultra# CuratorAI - Where Fashion Meets Intelligence

AI-powered fashion recommendation platform that combines computer vision, machine learning, and social features to deliver personalized outfit recommendations.

## 🎯 Features

- **AI-Powered Recommendations**: Personalized outfit suggestions based on style, budget, and preferences
- **Visual Search**: Upload any fashion photo to find similar outfits
- **Wardrobe Management**: Track and organize your clothing items
- **Social Feed**: Share outfits, follow fashion influencers, and get inspired
- **Curated Lookbooks**: Browse professional fashion collections
- **Virtual Try-On**: AR-powered virtual fitting room
- **Smart Shopping**: Seamless shopping experience with integrated cart and checkout
- **Admin Dashboard**: Comprehensive content moderation and analytics

## 🏗️ Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── domain/              # Core business logic (entities, interfaces)
│   ├── entities/        # Business entities
│   └── repositories/    # Repository interfaces (ports)
├── application/         # Use cases and application services
│   ├── use-cases/       # Business use cases
│   └── services/        # Application services
├── infrastructure/      # External services and implementations
│   ├── api/             # API clients
│   └── repositories/    # Repository implementations (adapters)
├── presentation/        # UI layer
│   ├── components/      # React components
│   ├── pages/           # Page components
│   └── routes/          # Route configuration
└── shared/              # Shared utilities
    ├── store/           # Redux state management
    ├── hooks/           # Custom React hooks
    └── utils/           # Utility functions
```

## 🎨 Design System

### Colors

- **Primary**: Deep Charcoal Black (`#111111`), Ivory White (`#F8F8F8`)
- **Accent**: Crimson Red (`#D72638`), Royal Blue (`#3A6FF7`)
- **Neutral**: Cool Gray (`#7A7A7A`), Soft Beige (`#E8E2D3`)

### Typography

- **Logo/Tagline**: Playfair Display
- **Headings**: Montserrat Bold
- **Body Text**: Inter Regular

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-org/curatorai.git
cd curatorai
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - UI component library
- **Framer Motion** - Animation library

### State Management

- **Redux Toolkit** - State management
- **React Redux** - React bindings for Redux

### Routing

- **React Router v6** - Client-side routing

### API & Data

- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Utilities

- **date-fns** - Date manipulation
- **clsx** & **tailwind-merge** - Conditional class management
- **class-variance-authority** - Component variants

## 📁 Project Structure

### Domain Layer (Core Business Logic)

**Entities**: User, Outfit, Wardrobe, Social, Lookbook, Cart, Notification, Admin, VirtualTryOn, Search

**Repository Interfaces**: Define contracts for data access without implementation details

### Application Layer (Use Cases)

- Authentication (Login, Register, Password Reset)
- Outfit Recommendations
- Wardrobe Management
- Social Features
- Visual Search
- Shopping Cart

### Infrastructure Layer (External Services)

- API Client with interceptors
- Repository implementations
- WebSocket service
- Third-party integrations

### Presentation Layer (UI)

- **Pages**: Landing, Auth, Home, Wardrobe, Search, Feed, Lookbooks, Cart, Admin
- **Components**: Reusable UI components from shadcn/ui
- **Routes**: Route configuration with React Router

## 🔐 Authentication

The application supports multiple authentication methods:

- Email/Password
- Google OAuth
- Facebook OAuth

JWT tokens are stored in localStorage with automatic refresh on expiration.

## 🎨 Styling Guidelines

- Use Tailwind CSS utility classes
- Follow the design system colors and typography
- Use shadcn/ui components for consistency
- Leverage the `cn()` utility for conditional classes

## 🧪 Development Workflow

1. **Feature Development**:
   - Create domain entities in `src/domain/entities/`
   - Define repository interfaces in `src/domain/repositories/`
   - Implement use cases in `src/application/use-cases/`
   - Create repository implementations in `src/infrastructure/repositories/`
   - Build UI in `src/presentation/`

2. **State Management**:
   - Define Redux slices in `src/shared/store/slices/`
   - Create custom hooks in `src/shared/hooks/`

3. **Component Development**:
   - Use shadcn/ui base components
   - Follow the established design system
   - Ensure TypeScript type safety

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration with path aliases
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration with custom theme
- `.eslintrc.cjs` - ESLint rules
- `.prettierrc` - Code formatting rules

## 📱 Features Roadmap

### MVP (Current)

- ✅ Authentication (Login, Register, OAuth)
- ✅ Outfit Recommendations
- ✅ Visual Search
- ✅ Wardrobe Management
- ✅ Social Feed
- ✅ Lookbooks
- ✅ Shopping Cart
- ✅ Admin Dashboard

### Future Enhancements

- [ ] Virtual Try-On with AR
- [ ] Advanced ML recommendations
- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 👥 Team

- **K&O Curator Technologies Group Ltd.** - Product Owner
- **Sumic IT Solutions Ltd.** - Development Partner

## 📞 Support

For support, email support@curatorai.com or join our Slack channel.

---

**Built with ❤️ using Clean Architecture principles**
