'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  DollarSign,
  Target,
  Users,
  Award,
  AlertCircle
} from 'lucide-react';

interface DealAnalytics {
  summary: {
    totalDeals: number;
    totalValue: number;
    wonDeals: number;
    lostDeals: number;
    openDeals: number;
    wonValue: number;
    lostValue: number;
    openValue: number;
    winRate: number;
    averageDealSize: number;
  };
  pipelineStats: Record<string, { count: number; value: number }>;
}

interface UserPerformance {
  userId: string;
  userName: string;
  totalDeals: number;
  totalValue: number;
  wonDeals: number;
  lostDeals: number;
  wonValue: number;
  openDeals: number;
  openValue: number;
  winRate: number;
  averageDealSize: number;
}

interface WinLossAnalysis {
  summary: {
    totalClosed: number;
    won: number;
    lost: number;
    winRate: number;
    wonValue: number;
    lostValue: number;
  };
  winReasons: Record<string, number>;
  lossReasons: Record<string, number>;
  industryStats: Array<{
    industry: string;
    won: number;
    lost: number;
    totalValue: number;
    wonValue: number;
    winRate: number;
  }>;
}

export default function ReportsPage() {
  const [dealAnalytics, setDealAnalytics] = useState<DealAnalytics | null>(null);
  const [userPerformance, setUserPerformance] = useState<UserPerformance[]>([]);
  const [winLossAnalysis, setWinLossAnalysis] = useState<WinLossAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [selectedUser, setSelectedUser] = useState('all');

  useEffect(() => {
    fetchReportsData();
  }, [dateRange, selectedUser]);

  const fetchReportsData = async () => {
    try {
      // Simulate API calls - replace with actual API calls
      const mockDealAnalytics: DealAnalytics = {
        summary: {
          totalDeals: 143,
          totalValue: 2450000,
          wonDeals: 45,
          lostDeals: 23,
          openDeals: 75,
          wonValue: 890000,
          lostValue: 340000,
          openValue: 1220000,
          winRate: 66.2,
          averageDealSize: 17133
        },
        pipelineStats: {
          'Sales Pipeline': { count: 98, value: 1680000 },
          'Enterprise Pipeline': { count: 32, value: 560000 },
          'Partner Pipeline': { count: 13, value: 210000 }
        }
      };

      const mockUserPerformance: UserPerformance[] = [
        {
          userId: '1',
          userName: 'John Smith',
          totalDeals: 32,
          totalValue: 540000,
          wonDeals: 12,
          lostDeals: 8,
          wonValue: 210000,
          openDeals: 12,
          openValue: 330000,
          winRate: 60.0,
          averageDealSize: 16875
        },
        {
          userId: '2',
          userName: 'Sarah Johnson',
          totalDeals: 28,
          totalValue: 480000,
          wonDeals: 15,
          lostDeals: 5,
          wonValue: 320000,
          openDeals: 8,
          openValue: 160000,
          winRate: 75.0,
          averageDealSize: 17143
        },
        {
          userId: '3',
          userName: 'Mike Davis',
          totalDeals: 25,
          totalValue: 420000,
          wonDeals: 10,
          lostDeals: 7,
          wonValue: 180000,
          openDeals: 8,
          openValue: 240000,
          winRate: 58.8,
          averageDealSize: 16800
        }
      ];

      const mockWinLossAnalysis: WinLossAnalysis = {
        summary: {
          totalClosed: 68,
          won: 45,
          lost: 23,
          winRate: 66.2,
          wonValue: 890000,
          lostValue: 340000
        },
        winReasons: {
          'Best Price': 15,
          'Superior Features': 12,
          'Better Support': 8,
          'Existing Relationship': 6,
          'Implementation Speed': 4
        },
        lossReasons: {
          'Price Too High': 8,
          'Missing Features': 6,
          'Competitor Chosen': 5,
          'Budget Constraints': 3,
          'Timeline Issues': 1
        },
        industryStats: [
          {
            industry: 'Technology',
            won: 18,
            lost: 7,
            totalValue: 450000,
            wonValue: 320000,
            winRate: 72.0
          },
          {
            industry: 'Healthcare',
            won: 12,
            lost: 8,
            totalValue: 380000,
            wonValue: 240000,
            winRate: 60.0
          },
          {
            industry: 'Finance',
            won: 15,
            lost: 8,
            totalValue: 400000,
            wonValue: 330000,
            winRate: 65.2
          }
        ]
      };

      setDealAnalytics(mockDealAnalytics);
      setUserPerformance(mockUserPerformance);
      setWinLossAnalysis(mockWinLossAnalysis);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports data:', error);
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      console.log(`Exporting reports as ${format}`);
      // Implement export functionality
    } catch (error) {
      console.error('Error exporting reports:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive sales performance and analytics dashboard
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Deal Analytics Overview */}
      {dealAnalytics && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dealAnalytics.summary.totalDeals}</div>
                <p className="text-xs text-muted-foreground">
                  {dealAnalytics.summary.openDeals} open deals
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(dealAnalytics.summary.totalValue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(dealAnalytics.summary.openValue)} in pipeline
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPercentage(dealAnalytics.summary.winRate)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {dealAnalytics.summary.wonDeals} won, {dealAnalytics.summary.lostDeals} lost
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(dealAnalytics.summary.averageDealSize)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per deal average
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Pipeline Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Performance</CardTitle>
              <CardDescription>
                Deal distribution across different pipelines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(dealAnalytics.pipelineStats).map(([pipeline, stats]) => (
                  <div key={pipeline} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{pipeline}</p>
                      <p className="text-sm text-muted-foreground">
                        {stats.count} deals
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(stats.value)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(stats.value / stats.count)} avg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* User Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>
            Individual sales representative performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userPerformance.map((user) => (
              <div key={user.userId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {user.userName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{user.userName}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.totalDeals} deals • {formatPercentage(user.winRate)} win rate
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-right">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="font-bold">{formatCurrency(user.totalValue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Won Value</p>
                    <p className="font-bold text-green-600">{formatCurrency(user.wonValue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Deal</p>
                    <p className="font-bold">{formatCurrency(user.averageDealSize)}</p>
                  </div>
                  <Badge variant={user.winRate >= 70 ? 'default' : user.winRate >= 50 ? 'secondary' : 'destructive'}>
                    {user.winRate >= 70 ? 'Excellent' : user.winRate >= 50 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Win-Loss Analysis */}
      {winLossAnalysis && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Win Reasons</CardTitle>
              <CardDescription>
                Top reasons for winning deals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(winLossAnalysis.winReasons).map(([reason, count]) => (
                  <div key={reason} className="flex items-center justify-between">
                    <span className="text-sm">{reason}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(count / Math.max(...Object.values(winLossAnalysis.winReasons))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Loss Reasons</CardTitle>
              <CardDescription>
                Top reasons for losing deals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(winLossAnalysis.lossReasons).map(([reason, count]) => (
                  <div key={reason} className="flex items-center justify-between">
                    <span className="text-sm">{reason}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${(count / Math.max(...Object.values(winLossAnalysis.lossReasons))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Industry Performance */}
      {winLossAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>Industry Performance</CardTitle>
            <CardDescription>
              Win rates and performance by industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {winLossAnalysis.industryStats.map((industry) => (
                <div key={industry.industry} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{industry.industry}</p>
                    <p className="text-sm text-muted-foreground">
                      {industry.won + industry.lost} total deals
                    </p>
                  </div>
                  <div className="flex items-center space-x-6 text-right">
                    <div>
                      <p className="text-sm text-muted-foreground">Win Rate</p>
                      <p className="font-bold">{formatPercentage(industry.winRate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Won Value</p>
                      <p className="font-bold text-green-600">{formatCurrency(industry.wonValue)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Value</p>
                      <p className="font-bold">{formatCurrency(industry.totalValue)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 