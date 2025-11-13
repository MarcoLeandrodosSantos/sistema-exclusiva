import React, { useState, useEffect } from 'react';
import { Customer, Service, services, Measurement, PaymentMethod, paymentMethods, Color, colors } from '../types.ts';
import { UserPlusIcon, WrenchScrewdriverIcon, RulerIcon, TrashIcon, CurrencyDollarIcon, CreditCardIcon, CalendarDaysIcon, DocumentArrowDownIcon, PencilIcon, XMarkIcon, UserIcon } from './Icons.tsx';

interface CustomerFormProps {
  onSaveCustomer: (customer: Customer | Omit<Customer, 'id'>) => void;
  editingCustomer: Customer | null;
  onCancelEditing: () => void;
  attendants: readonly string[];
  onAddAttendant: (name: string) => void;
}

const initialFormState: Omit<Customer, 'id'> = {
    nome: '',
    cpf: '',
    atendente: '',
    endereco: '',
    numero: '',
    complemento: '',
    cep: '',
    cidade: '',
    estado: '',
    condominio: '',
    servicos: [] as Service[],
    medidas: [] as Measurement[],
    paymentMethod: null as PaymentMethod,
    creditCardInstallments: null as number | null,
    totalValue: '',
    budgetDate: '',
    serviceDate: '',
};

const CustomerForm: React.FC<CustomerFormProps> = ({ onSaveCustomer, editingCustomer, onCancelEditing, attendants, onAddAttendant }) => {
  const [formData, setFormData] = useState<Omit<Customer, 'id'> | Customer>(initialFormState);

  useEffect(() => {
    if (editingCustomer) {
      setFormData(editingCustomer);
    } else {
      setFormData(initialFormState);
    }
  }, [editingCustomer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const service = value as Service;
    
    setFormData(prev => {
        const currentServices = prev.servicos;
        if (checked) {
            return { ...prev, servicos: [...currentServices, service] };
        } else {
            return { ...prev, servicos: currentServices.filter(s => s !== service) };
        }
    });
  };

  const handleAddMeasurement = () => {
    setFormData(prev => ({
        ...prev,
        medidas: [
            ...prev.medidas,
            { id: crypto.randomUUID(), service: '', color: '', width: '', height: '', notes: '' }
        ]
    }));
  };

  const handleMeasurementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, id: string) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        medidas: prev.medidas.map(medida => 
            medida.id === id ? { ...medida, [name]: value } : medida
        )
    }));
  };

  const handleRemoveMeasurement = (id: string) => {
    setFormData(prev => ({
        ...prev,
        medidas: prev.medidas.filter(medida => medida.id !== id)
    }));
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newPaymentMethod = value as PaymentMethod;
    setFormData(prev => ({
        ...prev,
        paymentMethod: newPaymentMethod,
        creditCardInstallments: newPaymentMethod !== 'Cartão de Crédito' ? null : prev.creditCardInstallments,
    }));
  };

  const handleInstallmentsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData(prev => ({
        ...prev,
        creditCardInstallments: value ? parseInt(value, 10) : null,
    }));
  };

  const handleAddAttendant = () => {
    const name = window.prompt("Digite o nome do novo atendente:");
    if (name) {
        onAddAttendant(name);
        setFormData(prev => ({...prev, atendente: name}));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nome && formData.cpf && formData.endereco) {
      onSaveCustomer(formData);
      if (!editingCustomer) {
        setFormData(initialFormState);
      }
    } else {
        alert("Por favor, preencha os campos obrigatórios: Nome, CPF e Endereço.");
    }
  };

  const isEditing = !!editingCustomer;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 md:p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
        {isEditing ? (
            <PencilIcon className="h-7 w-7 mr-3 text-blue-500" />
        ) : (
            <UserPlusIcon className="h-7 w-7 mr-3 text-blue-500" />
        )}
        {isEditing ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-end gap-2">
            <div className="flex-grow">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" htmlFor="atendente">
                    Atendente
                </label>
                <select
                    id="atendente"
                    name="atendente"
                    value={formData.atendente || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="" disabled>Selecione...</option>
                    {attendants.map(name => <option key={name} value={name}>{name}</option>)}
                </select>
            </div>
            <button 
                type="button" 
                onClick={handleAddAttendant}
                className="px-4 py-2 h-10 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 text-sm"
            >
                Adicionar
            </button>
          </div>
          <div className="lg:col-span-1">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" htmlFor="nome">
              Nome Completo*
            </label>
            <input
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="nome"
              name="nome"
              type="text"
              placeholder="Ex: João da Silva"
              value={formData.nome}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" htmlFor="cpf">
              CPF*
            </label>
            <input
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="cpf"
              name="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="md:col-span-2">
             <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" htmlFor="endereco">
              Endereço*
            </label>
            <input
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="endereco"
              name="endereco"
              type="text"
              placeholder="Ex: Rua das Flores"
              value={formData.endereco}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" htmlFor="numero">
              Número
            </label>
            <input
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="numero"
              name="numero"
              type="text"
              placeholder="123"
              value={formData.numero}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" htmlFor="complemento">
              Complemento
            </label>
            <input
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="complemento"
              name="complemento"
              type="text"
              placeholder="Apto 4B"
              value={formData.complemento}
              onChange={handleInputChange}
            />
          </div>
           <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" htmlFor="cep">
              CEP
            </label>
            <input
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="cep"
              name="cep"
              type="text"
              placeholder="00000-000"
              value={formData.cep}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" htmlFor="cidade">
              Cidade
            </label>
            <input
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="cidade"
              name="cidade"
              type="text"
              placeholder="São Paulo"
              value={formData.cidade}
              onChange={handleInputChange}
            />
          </div>
           <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" htmlFor="estado">
              Estado
            </label>
            <input
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="estado"
              name="estado"
              type="text"
              placeholder="SP"
              value={formData.estado}
              onChange={handleInputChange}
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
             <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" htmlFor="condominio">
              Condomínio
            </label>
            <input
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="condominio"
              name="condominio"
              type="text"
              placeholder="Ex: Condomínio Residencial Sol Nascente"
              value={formData.condominio}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <hr className="my-8 border-gray-200 dark:border-gray-700" />
        
        <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <WrenchScrewdriverIcon className="h-6 w-6 mr-3 text-blue-500" />
                Serviços Contratados
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {services.map(service => (
                    <label key={service} className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            value={service}
                            checked={formData.servicos.includes(service)}
                            onChange={handleServiceChange}
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">{service}</span>
                    </label>
                ))}
            </div>
        </div>

        <hr className="my-8 border-gray-200 dark:border-gray-700" />

        <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <RulerIcon className="h-6 w-6 mr-3 text-blue-500" />
                Medidas
            </h3>
            <div className="space-y-4">
                {formData.medidas.map((medida) => (
                    <div key={medida.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="md:col-span-3">
                           <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1" htmlFor={`service-${medida.id}`}>
                                Serviço
                            </label>
                            <select
                                id={`service-${medida.id}`}
                                name="service"
                                value={medida.service}
                                onChange={(e) => handleMeasurementChange(e, medida.id)}
                                className="w-full px-3 py-2 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>Selecione...</option>
                                {services.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                           <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1" htmlFor={`color-${medida.id}`}>
                                Cor
                            </label>
                            <select
                                id={`color-${medida.id}`}
                                name="color"
                                value={medida.color}
                                onChange={(e) => handleMeasurementChange(e, medida.id)}
                                className="w-full px-3 py-2 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>Selecione...</option>
                                {colors.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1" htmlFor={`width-${medida.id}`}>
                                Largura (m)
                            </label>
                            <input
                                id={`width-${medida.id}`}
                                name="width"
                                type="text"
                                placeholder="Ex: 1.50"
                                value={medida.width}
                                onChange={(e) => handleMeasurementChange(e, medida.id)}
                                className="w-full px-3 py-2 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1" htmlFor={`height-${medida.id}`}>
                                Altura (m)
                            </label>
                            <input
                                id={`height-${medida.id}`}
                                name="height"
                                type="text"
                                placeholder="Ex: 2.10"
                                value={medida.height}
                                onChange={(e) => handleMeasurementChange(e, medida.id)}
                                className="w-full px-3 py-2 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1" htmlFor={`notes-${medida.id}`}>
                                Anotações
                            </label>
                            <input
                                id={`notes-${medida.id}`}
                                name="notes"
                                type="text"
                                placeholder="Ex: Janela da sala"
                                value={medida.notes}
                                onChange={(e) => handleMeasurementChange(e, medida.id)}
                                className="w-full px-3 py-2 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="md:col-span-1 flex justify-end items-end h-full">
                            <button
                                type="button"
                                onClick={() => handleRemoveMeasurement(medida.id)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors"
                                aria-label="Remover medida"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4">
                <button
                    type="button"
                    onClick={handleAddMeasurement}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-offset-gray-800 transition duration-150 ease-in-out"
                >
                    Adicionar Medida
                </button>
            </div>
        </div>

        <hr className="my-8 border-gray-200 dark:border-gray-700" />

        <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <CalendarDaysIcon className="h-6 w-6 mr-3 text-blue-500" />
                Datas e Valores
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" htmlFor="totalValue">
                        Valor Total (R$)
                    </label>
                    <input
                        className="w-full px-4 py-2 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="totalValue"
                        name="totalValue"
                        type="text"
                        placeholder="Ex: 1250,50"
                        value={formData.totalValue}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" htmlFor="budgetDate">
                        Data do Orçamento
                    </label>
                    <input
                        className="w-full px-4 py-2 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="budgetDate"
                        name="budgetDate"
                        type="date"
                        value={formData.budgetDate}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2" htmlFor="serviceDate">
                        Data do Serviço
                    </label>
                    <input
                        className="w-full px-4 py-2 text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="serviceDate"
                        name="serviceDate"
                        type="date"
                        value={formData.serviceDate}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
        </div>
        
        <hr className="my-8 border-gray-200 dark:border-gray-700" />
        
        <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                <CurrencyDollarIcon className="h-6 w-6 mr-3 text-blue-500" />
                Pagamento
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {paymentMethods.map(method => (
                    <label key={method} className="flex items-center space-x-3 cursor-pointer p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400 dark:has-[:checked]:bg-blue-900/30 dark:has-[:checked]:border-blue-600 transition-all">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value={method}
                            checked={formData.paymentMethod === method}
                            onChange={handlePaymentMethodChange}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{method}</span>
                    </label>
                ))}
            </div>
            {formData.paymentMethod === 'Cartão de Crédito' && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <label htmlFor="creditCardInstallments" className="flex items-center text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                        <CreditCardIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400"/>
                        Número de Parcelas
                    </label>
                    <select
                        id="creditCardInstallments"
                        name="creditCardInstallments"
                        value={formData.creditCardInstallments || ''}
                        onChange={handleInstallmentsChange}
                        className="w-full md:w-1/3 px-4 py-2 text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled>Selecione...</option>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}x
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>


        <div className="mt-8 flex justify-end gap-4">
            {isEditing && (
                <button
                    type="button"
                    onClick={onCancelEditing}
                    className="flex items-center justify-center px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800 transition duration-300 ease-in-out"
                >
                    <XMarkIcon className="h-5 w-5 mr-2" />
                    Cancelar Edição
                </button>
            )}
            <button
                type="submit"
                className={`flex items-center justify-center px-6 py-3 font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-105 ${
                    isEditing 
                        ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                }`}
            >
                {isEditing ? (
                    <>
                        <PencilIcon className="h-5 w-5 mr-2" />
                        Atualizar Cliente
                    </>
                ) : (
                    <>
                        <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                        Salvar Cliente
                    </>
                )}
            </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;