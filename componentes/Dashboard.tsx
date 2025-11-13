import React, { useState, useMemo, useRef } from 'react';
import { Customer, Service } from '../types.ts';
import { ChartBarIcon, CurrencyDollarIcon, WrenchScrewdriverIcon, PrinterIcon } from './Icons.tsx';

interface DashboardProps {
  customers: Customer[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const Dashboard: React.FC<DashboardProps> = ({ customers }) => {
  const [periodType, setPeriodType] = useState<'day' | 'month' | 'year'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const { totalRevenue, revenueByService } = useMemo(() => {
    if (!selectedDate) return { totalRevenue: 0, revenueByService: [] };

    const filtered = customers.filter(customer => {
      if (!customer.serviceDate || !customer.totalValue) return false;
      const serviceDateStr = customer.serviceDate;

      if (periodType === 'day') {
        return serviceDateStr === selectedDate;
      }
      if (periodType === 'month') {
        return serviceDateStr.substring(0, 7) === selectedDate.substring(0, 7);
      }
      if (periodType === 'year') {
        return serviceDateStr.substring(0, 4) === selectedDate.substring(0, 4);
      }
      return false;
    });

    const revenue = filtered.reduce((acc, customer) => {
      const value = parseFloat(customer.totalValue!.replace(',', '.'));
      return acc + (isNaN(value) ? 0 : value);
    }, 0);

    const serviceRevenue: { [key in Service]?: number } = {};
    filtered.forEach(customer => {
      const value = parseFloat(customer.totalValue!.replace(',', '.'));
      if (isNaN(value)) return;
      
      customer.servicos.forEach(service => {
        serviceRevenue[service] = (serviceRevenue[service] || 0) + value;
      });
    });

    const sortedServices = Object.entries(serviceRevenue)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, total]) => ({ name: name as Service, total: total as number }));

    return { totalRevenue: revenue, revenueByService: sortedServices };
  }, [customers, periodType, selectedDate]);

  const maxServiceRevenue = revenueByService.length > 0 ? Math.max(...revenueByService.map(s => s.total)) : 0;
  
  const handlePrint = () => {
    const periodMap = { day: 'Dia', month: 'Mês', year: 'Ano' };
    const date = new Date(selectedDate + 'T00:00:00');
    let formattedDate;
    if (periodType === 'day') formattedDate = date.toLocaleDateString('pt-BR');
    if (periodType === 'month') formattedDate = `${date.toLocaleString('pt-BR', { month: 'long' })} de ${date.getFullYear()}`;
    if (periodType === 'year') formattedDate = date.getFullYear();

    const printContent = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Relatório do Dashboard</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-white font-sans p-8">
            <div class="max-w-4xl mx-auto">
                <header class="pb-4 border-b text-center">
                    <h1 class="text-3xl font-bold text-gray-800">Exclusiva Proteções</h1>
                    <p class="text-gray-500">Relatório de Desempenho</p>
                </header>
                <main class="mt-8">
                    <section class="mb-8 p-4 bg-gray-50 rounded-lg">
                        <h2 class="text-xl font-semibold mb-2">Resumo do Período</h2>
                        <p><strong>Período:</strong> ${periodMap[periodType]}</p>
                        <p><strong>Data:</strong> ${formattedDate}</p>
                        <p class="mt-4 text-2xl font-bold"><strong>Entradas Totais:</strong> ${formatCurrency(totalRevenue)}</p>
                    </section>
                    <section>
                        <h2 class="text-xl font-semibold border-b pb-2 mb-4">Receita por Categoria de Serviço</h2>
                        ${revenueByService.length > 0 ? `
                        <table class="w-full text-left">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="p-2 font-semibold">Serviço</th>
                                    <th class="p-2 font-semibold text-right">Valor Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${revenueByService.map(service => `
                                    <tr class="border-b">
                                        <td class="p-2">${service.name}</td>
                                        <td class="p-2 text-right">${formatCurrency(service.total)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        ` : '<p class="text-center text-gray-500 py-4">Nenhum dado de serviço encontrado para este período.</p>'}
                    </section>
                </main>
                <footer class="text-center text-xs text-gray-400 mt-12 pt-4 border-t">
                    <p>Relatório gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
                </footer>
            </div>
        </body>
        </html>
    `;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    }
  };

  const renderDateInput = () => {
    switch (periodType) {
      case 'day':
        return (
          <input
            id="date-filter"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case 'month':
        return (
          <input
            id="date-filter"
            type="month"
            value={selectedDate.substring(0, 7)}
            onChange={(e) => setSelectedDate(`${e.target.value}-01`)}
            className="w-full px-4 py-2 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case 'year':
        return (
          <input
            id="date-filter"
            type="number"
            placeholder="Ano"
            value={selectedDate.substring(0, 4)}
            onChange={(e) => {
                if (/^\d{4}$/.test(e.target.value)) {
                    setSelectedDate(`${e.target.value}-01-01`);
                }
            }}
            className="w-full px-4 py-2 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div ref={dashboardRef} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 md:p-8 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <ChartBarIcon className="h-7 w-7 mr-3 text-blue-500" />
            Dashboard
        </h2>
        <button
            onClick={handlePrint}
            className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800 transition duration-150"
            aria-label="Imprimir Dashboard"
        >
            <PrinterIcon className="h-5 w-5 mr-2" />
            Imprimir
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="w-full md:w-auto">
              <label htmlFor="periodType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filtrar Período</label>
              <select
                  id="periodType"
                  value={periodType}
                  onChange={(e) => setPeriodType(e.target.value as 'day' | 'month' | 'year')}
                  className="w-full h-full px-4 py-2 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                  <option value="day">Dia</option>
                  <option value="month">Mês</option>
                  <option value="year">Ano</option>
              </select>
          </div>
          <div className="w-full md:w-auto">
             <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selecionar Data</label>
             {renderDateInput()}
          </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full mr-4">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600 dark:text-green-300"/>
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Entradas no Período</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{formatCurrency(totalRevenue)}</p>
            </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
            <div className="flex items-center mb-4">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full mr-4">
                    <WrenchScrewdriverIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-300"/>
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Receita por Categoria de Serviço</p>
                    <p className="text-xl font-bold text-gray-800 dark:text-white">Top 5</p>
                </div>
            </div>
            <div className="space-y-3">
                {revenueByService.length > 0 ? revenueByService.map(service => (
                    <div key={service.name}>
                        <div className="flex justify-between items-center text-sm mb-1">
                            <span className="font-medium text-gray-700 dark:text-gray-300">{service.name}</span>
                            <span className="font-semibold text-gray-500 dark:text-gray-400">{formatCurrency(service.total)}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                            <div 
                                className="bg-indigo-500 h-2.5 rounded-full" 
                                style={{ width: `${maxServiceRevenue > 0 ? (service.total / maxServiceRevenue) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">Nenhum serviço encontrado para este período.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;