# Franklin Terminal - Cost Analysis

## 📊 **Usage Scenario**

- **Briefing Updates**: 6x per day (every 4 hours)
- **User Base**: Scaling from 10 to 1,000+ users
- **Data Sources**: NewsAPI (aggregates multiple sources)
- **Architecture**: Firebase Functions + Firestore + Storage

## 💰 **Firebase Pricing Breakdown**

### **1. Firebase Functions**

#### **Function Invocations**

- **Scheduled Function**: `processArticles` runs 2x daily
- **User-Specific Function**: `getUserBriefing` called per user
- **Health Check**: `health` endpoint for monitoring

**Cost Calculation:**

```
Free Tier: 125K invocations/month
Paid Tier: $0.40 per million invocations

Daily Invocations:
- Scheduled processing: 6 invocations
- User briefings: 6 × number of users
- Health checks: 24 invocations
- Development/testing: ~50 invocations

Monthly Invocations (100 users):
- Scheduled: 180
- User briefings: 18,000
- Health checks: 720
- Development: 1,500
- Total: ~20,400 invocations/month

Monthly Cost (100 users): FREE (within free tier)

Monthly Invocations (1,000 users):
- Scheduled: 180
- User briefings: 180,000
- Health checks: 720
- Development: 1,500
- Total: ~182,400 invocations/month

Monthly Cost (1,000 users): FREE (within free tier)

Monthly Invocations (10,000 users):
- Scheduled: 180
- User briefings: 1,800,000
- Health checks: 720
- Development: 1,500
- Total: ~1,802,400 invocations/month

Monthly Cost (10,000 users): ~$0.72/month
```

#### **Compute Time**

- **Free Tier**: 40K GB-seconds/month
- **Paid Tier**: $0.0025 per GB-second

**Cost Calculation:**

```
Average Function Runtime: 30 seconds
Memory Allocation: 512MB (0.5 GB)

GB-seconds per invocation: 30 × 0.5 = 15 GB-seconds

Monthly GB-seconds (100 users):
- Total invocations: 20,400
- GB-seconds: 20,400 × 15 = 306,000 GB-seconds

Monthly Cost (100 users): ~$0.77/month

Monthly GB-seconds (1,000 users):
- Total invocations: 182,400
- GB-seconds: 182,400 × 15 = 2,736,000 GB-seconds

Monthly Cost (1,000 users): ~$6.84/month

Monthly GB-seconds (10,000 users):
- Total invocations: 1,802,400
- GB-seconds: 1,802,400 × 15 = 27,036,000 GB-seconds

Monthly Cost (10,000 users): ~$67.59/month
```

### **2. Firestore Database**

#### **Document Reads**

- **Free Tier**: 50K reads/day
- **Paid Tier**: $0.06 per 100K reads

**Cost Calculation:**

```
Daily Reads per User:
- User profile: 6 reads (every 4 hours)
- Briefing data: 6 reads
- User preferences: 6 reads
- Total: 18 reads per user per day

Monthly Reads (100 users):
- Daily: 100 × 18 = 1,800 reads
- Monthly: 1,800 × 30 = 54,000 reads

Monthly Cost (100 users): FREE (within free tier)

Monthly Reads (1,000 users):
- Daily: 1,000 × 18 = 18,000 reads
- Monthly: 18,000 × 30 = 540,000 reads

Monthly Cost (1,000 users): FREE (within free tier)

Monthly Reads (10,000 users):
- Daily: 10,000 × 18 = 180,000 reads
- Monthly: 180,000 × 30 = 5,400,000 reads

Monthly Cost (10,000 users): ~$3.24/month
```

#### **Document Writes**

- **Free Tier**: 20K writes/day
- **Paid Tier**: $0.18 per 100K writes

**Cost Calculation:**

```
Daily Writes per User:
- Briefing updates: 6 writes (every 4 hours)
- User feedback: ~0.5 writes (estimated)
- Total: 6.5 writes per user per day

Monthly Writes (100 users):
- Daily: 100 × 6.5 = 650 writes
- Monthly: 650 × 30 = 19,500 writes

Monthly Cost (100 users): FREE (within free tier)

Monthly Writes (1,000 users):
- Daily: 1,000 × 6.5 = 6,500 writes
- Monthly: 6,500 × 30 = 195,000 writes

Monthly Cost (1,000 users): FREE (within free tier)

Monthly Writes (10,000 users):
- Daily: 10,000 × 6.5 = 65,000 writes
- Monthly: 65,000 × 30 = 1,950,000 writes

Monthly Cost (10,000 users): ~$3.51/month
```

#### **Storage**

- **Free Tier**: 1GB
- **Paid Tier**: $0.18 per GB/month

**Cost Calculation:**

```
Estimated Storage per User:
- User profile: 2KB
- Briefing data: 50KB per briefing
- Historical data: 1MB per user
- Total: ~1.1MB per user

Monthly Storage (100 users):
- Total: 100 × 1.1MB = 110MB

Monthly Cost (100 users): FREE (within free tier)

Monthly Storage (1,000 users):
- Total: 1,000 × 1.1MB = 1.1GB

Monthly Cost (1,000 users): ~$0.20/month

Monthly Storage (10,000 users):
- Total: 10,000 × 1.1MB = 11GB

Monthly Cost (10,000 users): ~$1.98/month
```

### **3. Firebase Storage**

#### **File Storage**

- **Free Tier**: 5GB
- **Paid Tier**: $0.026 per GB/month

**Cost Calculation:**

```
Estimated Storage per User:
- Cached articles: 100KB
- User assets: 50KB
- Total: ~150KB per user

Monthly Storage (100 users):
- Total: 100 × 150KB = 15MB

Monthly Cost (100 users): FREE (within free tier)

Monthly Storage (1,000 users):
- Total: 1,000 × 150KB = 150MB

Monthly Cost (1,000 users): FREE (within free tier)

Monthly Storage (10,000 users):
- Total: 10,000 × 150KB = 1.5GB

Monthly Cost (10,000 users): ~$0.04/month
```

### **4. External API Costs**

#### **NewsAPI**

- **Free Tier**: 1,000 requests/day
- **Paid Tier**: $449/month for 100K requests/day

**Cost Calculation:**

```
Daily API Calls:
- 6 scheduled runs × 1 source = 6 calls per day
- Additional calls for user-specific queries: ~150 calls per day
- Total: ~156 calls per day

Monthly Cost: FREE (within free tier)

## 📈 **Total Monthly Cost Summary**

| User Count | Functions | Firestore | Storage | Total   |
| ---------- | --------- | --------- | ------- | ------- |
| 100        | $0.77     | FREE      | FREE    | $0.77   |
| 1,000      | $6.84     | FREE      | $0.20   | $7.04   |
| 10,000     | $67.59    | $6.75     | $2.02   | $76.36  |
| 100,000    | $675.90   | $67.50    | $20.20  | $763.60 |

## 🎯 **Cost Optimization Strategies**

### **1. Caching**

- Cache API responses for 1-2 hours
- Reduce redundant API calls
- **Potential Savings**: 30-50% reduction in API costs

### **2. Batch Processing**

- Process multiple users in single function invocation
- Reduce function invocation count
- **Potential Savings**: 20-30% reduction in function costs

### **3. Data Retention**

- Archive old briefing data to cheaper storage
- Implement data lifecycle policies
- **Potential Savings**: 15-25% reduction in storage costs

### **4. Smart Scheduling**

- Only update briefings when new data is available
- Skip updates for inactive users
- **Potential Savings**: 10-20% reduction in compute costs

## 🚀 **Scaling Recommendations**

### **Phase 1: MVP (100 users)**

- **Cost**: ~$0.77/month
- **Strategy**: Use free tiers, minimal optimization

### **Phase 2: Growth (1,000 users)**

- **Cost**: ~$7.04/month
- **Strategy**: Implement caching, batch processing

### **Phase 3: Scale (10,000+ users)**

- **Cost**: ~$76.36/month
- **Strategy**: Full optimization, consider dedicated infrastructure

## 💡 **Additional Considerations**

### **Development Costs**

- Firebase emulator usage: FREE
- Testing and debugging: Minimal cost
- **Estimated**: $5-10/month during development

### **Monitoring and Logging**

- Firebase Functions logs: FREE (within limits)
- Custom monitoring: $10-20/month for advanced analytics

### **Backup and Recovery**

- Firestore automatic backups: FREE
- Custom backup solutions: $5-15/month

## 🎉 **Conclusion**

**Franklin Terminal remains cost-effective** even with 6x daily updates:

- **100 users**: ~$0.77/month (essentially free)
- **1,000 users**: ~$7.04/month (very affordable)
- **10,000 users**: ~$76.36/month (reasonable for scale)

The architecture leverages Firebase's generous free tiers effectively, making it viable for both MVP and growth phases. The main cost drivers are function compute time and database operations, both of which can be optimized as you scale.
```
