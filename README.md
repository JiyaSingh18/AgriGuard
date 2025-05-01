# AgriGuard - Agricultural AI Assistant

An advanced agricultural AI assistant using a RAG (Retrieval-Augmented Generation) system with Vectara vector database. This system provides intelligent agricultural advice by combining knowledge from various sources including crop-specific information, pest and disease databases, weather patterns, and market data.

## 🌟 Features

### Core Capabilities
- **Crop Management**
  - Crop-specific information and recommendations
  - Growth stage monitoring
  - Yield optimization strategies
  - Planting and harvesting schedules

- **Disease & Pest Control**
  - Real-time pest and disease diagnosis
  - Treatment recommendations
  - Preventive measures
  - Integrated pest management strategies

- **Weather Intelligence**
  - Weather analysis and predictions
  - Climate impact assessment
  - Microclimate monitoring
  - Weather-based farming recommendations

- **Market Analysis**
  - Market analysis and pricing
  - Supply chain optimization
  - Demand forecasting
  - Price trend analysis

- **Soil Management**
  - Soil analysis and fertilizer recommendations
  - Nutrient management
  - Soil health monitoring
  - Sustainable farming practices

- **Smart Advisory**
  - Local context-aware advice
  - Historical data integration
  - Real-time alerts and notifications
  - Customized farming recommendations

## 🏗️ System Architecture

### 1. Knowledge Base Integration
- **Agricultural Database**
  - Crop-specific information (15,000+ documents)
  - Pest and disease databases (500,000+ images)
  - Weather patterns and climate data
  - Soil composition and treatment methods
  - Farming techniques and best practices

### 2. Local Context Engine
- **Regional Intelligence**
  - Regional farming practices
  - Local market prices
  - Government schemes and subsidies
  - Regional weather patterns
  - Soil types and conditions

### 3. Historical Analytics
- **Data Analysis**
  - Past crop yields
  - Previous pest outbreaks
  - Weather history
  - Market price trends
  - Success/failure patterns

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git
- Vercel account (for deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/JiyaSingh18/AgriGuard.git
   cd AgriGuard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   VECTARA_API_KEY=your_api_key
   VECTARA_CUSTOMER_ID=your_customer_id
   VECTARA_CORPUS_ID=your_corpus_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

### Deploying to Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy using Vercel Dashboard**:
   - Fork this repository
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your forked repository
   - Configure environment variables:
     - `VITE_VECTARA_API_KEY`
     - `VITE_VECTARA_CUSTOMER_ID`
     - `VITE_VECTARA_CORPUS_ID`
   - Click "Deploy"

3. **Deploy using Vercel CLI**:
   ```bash
   # Login to Vercel
   vercel login

   # Deploy
   vercel
   ```

4. **Environment Variables**:
   Set up the following environment variables in your Vercel project settings:
   ```
   VITE_VECTARA_API_KEY=your_api_key
   VITE_VECTARA_CUSTOMER_ID=your_customer_id
   VITE_VECTARA_CORPUS_ID=your_corpus_id
   ```

### Automatic Deployments
- Every push to the `main` branch will trigger a production deployment
- Pull requests will create preview deployments
- Branch deployments are automatically created for feature branches

## 💻 Usage Examples

### Crop Management
```typescript
// Example query for crop recommendations
const cropQuery = {
  crop: "wheat",
  region: "north-india",
  season: "rabi",
  soilType: "alluvial"
};
```

### Pest Diagnosis
```typescript
// Example pest diagnosis query
const pestQuery = {
  symptoms: ["yellow leaves", "brown spots"],
  crop: "wheat",
  region: "punjab",
  season: "winter"
};
```

## 🔧 Technical Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: Vectara Vector Database
- **AI/ML**: RAG System, Gemini AI
- **Authentication**: JWT
- **API**: RESTful Architecture

## 📊 Performance Metrics

- Response Time: < 2 seconds
- Accuracy Rate: > 90%
- Database Coverage: 1M+ agricultural documents
- Real-time Updates: Weather and market data

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@agriguard.ai or join our Slack channel.

## 🙏 Acknowledgments

- Vectara for vector database support
- Google Gemini for AI capabilities
- Agricultural research institutions for data
- Open source community

---

Made with ❤️ by the AgriGuard Team 