import React, { useState, useMemo, useEffect } from 'react';
import { Customer, FilterType, initialAttendants } from './types.ts';
import CustomerForm from './components/CustomerForm.tsx';
import CustomerList from './components/CustomerList.tsx';
import SearchBar from './components/SearchBar.tsx';
import Dashboard from './components/Dashboard.tsx';

const App: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const savedCustomers = localStorage.getItem('customers');
      return savedCustomers ? JSON.parse(savedCustomers) : [];
    } catch (error) {
      console.error('Falha ao carregar clientes do localStorage', error);
      return [];
    }
  });

  const [attendants, setAttendants] = useState<string[]>(() => {
    try {
      const savedAttendants = localStorage.getItem('attendants');
      return savedAttendants ? JSON.parse(savedAttendants) : [...initialAttendants];
    } catch (error) {
      console.error('Falha ao carregar atendentes do localStorage', error);
      return [...initialAttendants];
    }
  });

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('endereco');

  useEffect(() => {
    try {
      localStorage.setItem('customers', JSON.stringify(customers));
    } catch (error) {
      console.error('Falha ao salvar clientes no localStorage', error);
    }
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem('attendants', JSON.stringify(attendants));
    } catch (error) {
      console.error('Falha ao salvar atendentes no localStorage', error);
    }
  }, [attendants]);

  const handleSaveCustomer = (customerData: Customer | Omit<Customer, 'id'>) => {
    if ('id' in customerData && customerData.id) {
      // Atualizar cliente existente
      setCustomers(customers.map(c => c.id === customerData.id ? customerData : c));
    } else {
      // Criar novo cliente
      const newCustomer: Customer = {
        ...customerData,
        id: crypto.randomUUID(),
      };
      setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
    }
    setEditingCustomer(null); // Limpa o formulário e sai do modo de edição
  };

  const handleSelectCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEditing = () => {
    setEditingCustomer(null);
  };

  const handleAddAttendant = (name: string) => {
    if (name && !attendants.includes(name)) {
        setAttendants(prev => [...prev, name]);
    }
  };

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) {
      return customers;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return customers.filter((customer) => {
      if (filterType === 'budgetDate' || filterType === 'serviceDate') {
        // A data do input é 'YYYY-MM-DD'. A data do cliente também é uma string no mesmo formato.
        // É necessária uma correspondência exata.
        return customer[filterType] === searchTerm;
      }

      // Para campos de texto
      const customerValue = customer[filterType];
      if (typeof customerValue === 'string') {
        return customerValue.toLowerCase().includes(lowerCaseSearchTerm);
      }
      
      return false;
    });
  }, [customers, searchTerm, filterType]);

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Exclusiva <span className="text-blue-600 dark:text-blue-400">Proteções</span>
          </h1>
          <p className="text-md text-gray-500 dark:text-gray-400">
            Sistema de Gerenciamento de Clientes
          </p>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Dashboard customers={customers} />

        <CustomerForm 
          onSaveCustomer={handleSaveCustomer}
          editingCustomer={editingCustomer}
          onCancelEditing={handleCancelEditing}
          attendants={attendants}
          onAddAttendant={handleAddAttendant}
        />

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Lista de Clientes
            </h2>
            <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterType={filterType}
                setFilterType={setFilterType}
            />
            <CustomerList 
              customers={filteredCustomers} 
              onSelectCustomer={handleSelectCustomer}
              editingCustomerId={editingCustomer?.id || null}
            />
        </div>
      </main>

      <footer className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Exclusiva Proteções. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default App;