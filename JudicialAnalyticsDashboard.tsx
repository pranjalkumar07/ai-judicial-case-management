import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { useTranslations } from '../hooks/useTranslations';

const RulingDistributionChart: React.FC = () => {
    const t = useTranslations();

    const data = [
        { name: 'Affirmed', value: 65, color: '#36A2EB' },
        { name: 'Reversed', value: 18, color: '#FF6384' },
        { name: 'Remanded', value: 12, color: '#FFCE56' },
        { name: 'Dismissed', value: 5, color: '#9966FF' },
    ];

    return (
        <div className="h-[300px] w-full">
            <h3 className="text-lg font-semibold mb-4 text-center">{t.judicialAnalytics.rulingDistribution}</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

const StatuteFrequencyChart: React.FC = () => {
    const t = useTranslations();
    
    const data = [
        { name: 'Statute 198.A', count: 82 },
        { name: 'Precedent B v. C', count: 65 },
        { name: 'Regulation 42-CFR', count: 41 },
        { name: 'Statute 210.F', count: 35 },
        { name: 'Precedent X v. Y', count: 19 },
    ];
    
    return (
        <div className="h-[300px] w-full">
            <h3 className="text-lg font-semibold mb-4 text-center">{t.judicialAnalytics.statuteFrequency}</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4BC0C0" radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export const JudicialAnalyticsDashboard: React.FC = () => {
  const t = useTranslations();
  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-theme-foreground mb-6">{t.judicialAnalytics.title}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-theme-card p-6 rounded-2xl shadow-premium border border-theme-border">
            <RulingDistributionChart />
        </div>
        <div className="bg-theme-card p-6 rounded-2xl shadow-premium border border-theme-border">
            <StatuteFrequencyChart />
        </div>
      </div>
    </div>
  );
};
