import React from 'react';
import { FilterType } from '../types.ts';
import { MagnifyingGlassIcon } from './Icons.tsx';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, filterType, setFilterType }) => {
  const isDateFilter = filterType === 'budgetDate' || filterType === 'serviceDate';

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value as FilterType);
    setSearchTerm(''); // Limpa o termo de busca ao mudar o filtro
  };
  
  const placeholderText: Record<FilterType, string> = {
    endereco: 'endereço',
    condominio: 'condomínio',
    budgetDate: 'data de orçamento',
    serviceDate: 'data de serviço'
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
      <div className="relative w-full md:flex-1">
        {!isDateFilter && (
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
        <input
          type={isDateFilter ? 'date' : 'text'}
          placeholder={isDateFilter ? '' : `Pesquisar por ${placeholderText[filterType]}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pr-4 py-3 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDateFilter ? 'pl-4' : 'pl-12'}`}
        />
      </div>
      <div className="w-full md:w-auto">
        <select
          value={filterType}
          onChange={handleFilterChange}
          className="w-full h-full px-4 py-3 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="endereco">Filtrar por Endereço</option>
          <option value="condominio">Filtrar por Condomínio</option>
          <option value="budgetDate">Filtrar por Data de Orçamento</option>
          <option value="serviceDate">Filtrar por Data de Serviço</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;