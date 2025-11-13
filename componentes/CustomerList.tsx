import React from 'react';
import { Customer } from '../types.ts';
import { BuildingOfficeIcon, MapPinIcon, CheckBadgeIcon, RulerIcon, CurrencyDollarIcon, CalendarDaysIcon, PrinterIcon, UserIcon } from './Icons.tsx';

interface CustomerListProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  editingCustomerId: string | null;
}

const CustomerCard: React.FC<{ customer: Customer; onSelect: () => void; isEditing: boolean }> = ({ customer, onSelect, isEditing }) => {
    
    const handlePrint = (e: React.MouseEvent) => {
        e.stopPropagation(); // Impede que o clique acione o onSelect do card
        const printContent = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Orçamento - ${customer.nome}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                @media print {
                    .no-print {
                        display: none;
                    }
                }
            </style>
        </head>
        <body class="bg-white font-sans p-8">
            <div class="max-w-4xl mx-auto">
                <header class="flex justify-between items-center pb-4 border-b">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-800">Exclusiva Proteções</h1>
                        <p class="text-gray-500">Orçamento de Serviços</p>
                    </div>
                    <div class="text-right">
                        ${customer.budgetDate ? `<p class="text-sm text-gray-600"><strong>Data do Orçamento:</strong> ${new Date(customer.budgetDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>` : ''}
                        ${customer.serviceDate ? `<p class="text-sm text-gray-600"><strong>Data do Serviço:</strong> ${new Date(customer.serviceDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>` : ''}
                    </div>
                </header>

                <main class="mt-8">
                    <section id="customer-details" class="mb-8">
                        <h2 class="text-xl font-semibold border-b pb-2 mb-4">Dados do Cliente</h2>
                        <div class="grid grid-cols-2 gap-x-8 gap-y-2 text-gray-700">
                            <p><strong>Nome:</strong> ${customer.nome}</p>
                            <p><strong>CPF:</strong> ${customer.cpf}</p>
                            <p class="col-span-2"><strong>Endereço:</strong> ${customer.endereco}, ${customer.numero} ${customer.complemento ? `- ${customer.complemento}` : ''}</p>
                            <p><strong>Condomínio:</strong> ${customer.condominio}</p>
                            <p><strong>Cidade/Estado:</strong> ${customer.cidade} - ${customer.estado}</p>
                            <p><strong>CEP:</strong> ${customer.cep}</p>
                            ${customer.atendente ? `<p><strong>Atendente:</strong> ${customer.atendente}</p>` : ''}
                        </div>
                    </section>

                    ${customer.medidas && customer.medidas.length > 0 ? `
                    <section id="measurements" class="mb-8">
                        <h2 class="text-xl font-semibold border-b pb-2 mb-4">Detalhes dos Serviços e Medidas</h2>
                        <table class="w-full text-left">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="p-2 font-semibold">Serviço</th>
                                    <th class="p-2 font-semibold">Cor</th>
                                    <th class="p-2 font-semibold">Largura</th>
                                    <th class="p-2 font-semibold">Altura</th>
                                    <th class="p-2 font-semibold">Anotações</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${customer.medidas.map(medida => `
                                    <tr class="border-b">
                                        <td class="p-2">${medida.service || '-'}</td>
                                        <td class="p-2">${medida.color || '-'}</td>
                                        <td class="p-2">${medida.width ? `${medida.width}m` : '-'}</td>
                                        <td class="p-2">${medida.height ? `${medida.height}m` : '-'}</td>
                                        <td class="p-2">${medida.notes || '-'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </section>
                    ` : ''}

                    <section id="summary" class="mt-8 pt-4 border-t-2">
                         <div class="grid grid-cols-2 gap-8">
                            <div>
                                ${customer.servicos && customer.servicos.length > 0 ? `
                                <h3 class="font-semibold mb-2">Serviços Contratados:</h3>
                                <ul class="list-disc list-inside text-gray-700">
                                    ${customer.servicos.map(s => `<li>${s}</li>`).join('')}
                                </ul>
                                ` : ''}
                            </div>
                            <div class="text-right">
                                ${customer.paymentMethod ? `
                                <div class="mb-4">
                                    <p class="text-gray-600">Forma de Pagamento:</p>
                                    <p class="font-bold text-lg">${customer.paymentMethod}${customer.paymentMethod === 'Cartão de Crédito' && customer.creditCardInstallments ? ` - ${customer.creditCardInstallments}x` : ''}</p>
                                </div>
                                ` : ''}
                                ${customer.totalValue ? `
                                <div>
                                    <p class="text-gray-600">Valor Total:</p>
                                    <p class="font-bold text-2xl text-blue-600">R$ ${customer.totalValue}</p>
                                </div>
                                ` : ''}
                            </div>
                         </div>
                    </section>
                </main>
                
                <footer class="text-center text-xs text-gray-400 mt-12 pt-4 border-t">
                    <p>&copy; ${new Date().getFullYear()} Exclusiva Proteções. Todos os direitos reservados.</p>
                </footer>
            </div>
        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    }
    };
    
    const cardClasses = `bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 transition-all transform hover:scale-[1.02] hover:shadow-xl flex flex-col justify-between cursor-pointer ${
        isEditing ? 'ring-2 ring-blue-500 scale-[1.02] shadow-xl' : ''
    }`;

    return (
        <div className={cardClasses} onClick={onSelect}>
            <div>
                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-300">{customer.nome.charAt(0)}</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white break-words">{customer.nome}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">CPF: {customer.cpf}</p>
                    </div>
                </div>

                <div className="space-y-3 text-sm">
                    {customer.atendente && (
                       <div className="flex items-start">
                           <UserIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                           <div>
                               <p className="font-semibold text-gray-700 dark:text-gray-300">Atendente</p>
                               <p className="text-gray-600 dark:text-gray-400 break-words">{customer.atendente}</p>
                           </div>
                       </div>
                    )}
                    <div className="flex items-start">
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-gray-700 dark:text-gray-300">Condomínio</p>
                            <p className="text-gray-600 dark:text-gray-400 break-words">{customer.condominio}</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <MapPinIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-gray-700 dark:text-gray-300">Endereço</p>
                            <p className="text-gray-600 dark:text-gray-400 break-words">
                                {customer.endereco}, {customer.numero} {customer.complemento && `- ${customer.complemento}`}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 break-words">
                                {customer.cidade} - {customer.estado}, CEP: {customer.cep}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex-grow"></div>

            <div className="space-y-4 mt-4">
                {customer.servicos && customer.servicos.length > 0 && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-start">
                             <CheckBadgeIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">Serviços Contratados</p>
                                <div className="flex flex-wrap gap-2">
                                    {customer.servicos.map(service => (
                                        <span key={service} className="px-2.5 py-1 text-xs font-semibold text-blue-800 bg-blue-100 dark:text-blue-200 dark:bg-blue-900 rounded-full">
                                            {service}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {customer.medidas && customer.medidas.length > 0 && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-start">
                            <RulerIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">Medidas</p>
                                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                    {customer.medidas.map((medida) => (
                                        <li key={medida.id}>
                                            <div className="flex items-center flex-wrap">
                                                {medida.service && (
                                                    <span className="px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900 rounded-full mr-2 mb-1 sm:mb-0">
                                                        {medida.service}
                                                    </span>
                                                )}
                                                {medida.color && (
                                                    <span className="px-2 py-0.5 text-xs font-semibold text-indigo-800 bg-indigo-100 dark:text-indigo-200 dark:bg-indigo-900 rounded-full mr-2 mb-1 sm:mb-0">
                                                        {medida.color}
                                                    </span>
                                                )}
                                               <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md mr-2 whitespace-nowrap mb-1 sm:mb-0">
                                                   {medida.width || '...'}m x {medida.height || '...'}m
                                               </span>
                                            </div>
                                            {medida.notes && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 pl-1">{medida.notes}</p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
                
                {(customer.totalValue || customer.budgetDate || customer.serviceDate) && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-start">
                             <CalendarDaysIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">Detalhes do Serviço</p>
                                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                    {customer.totalValue && (
                                        <p><strong>Valor Total:</strong> R$ {customer.totalValue}</p>
                                    )}
                                    {customer.budgetDate && (
                                        <p><strong>Orçamento:</strong> {new Date(customer.budgetDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                                    )}
                                    {customer.serviceDate && (
                                        <p><strong>Serviço:</strong> {new Date(customer.serviceDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {customer.paymentMethod && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-start">
                             <CurrencyDollarIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-1">Pagamento</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {customer.paymentMethod}
                                    {customer.paymentMethod === 'Cartão de Crédito' && customer.creditCardInstallments && (
                                        <span className="font-semibold">
                                            {' '}- {customer.creditCardInstallments}x
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                    onClick={handlePrint}
                    className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800 transition duration-150 ease-in-out"
                    aria-label={`Imprimir orçamento de ${customer.nome}`}
                >
                    <PrinterIcon className="h-5 w-5 mr-2" />
                    Imprimir
                </button>
            </div>
        </div>
    );
};


const CustomerList: React.FC<CustomerListProps> = ({ customers, onSelectCustomer, editingCustomerId }) => {
  if (customers.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Nenhum cliente encontrado</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Cadastre um novo cliente ou ajuste sua busca para visualizar os resultados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {customers.map((customer) => (
        <CustomerCard 
            key={customer.id} 
            customer={customer}
            onSelect={() => onSelectCustomer(customer)}
            isEditing={customer.id === editingCustomerId}
        />
      ))}
    </div>
  );
};

export default CustomerList;