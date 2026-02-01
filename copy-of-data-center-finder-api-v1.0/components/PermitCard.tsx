
import React from 'react';
import { PermitData } from '../types';

interface PermitCardProps {
  permit: PermitData;
}

export const PermitCard: React.FC<PermitCardProps> = ({ permit }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
          {permit.id}
        </span>
        <span className="text-xs text-slate-500 font-medium">
          Issued: {permit.issueDate}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 mb-2">{permit.facility}</h3>
      <p className="text-sm text-slate-600 mb-4 flex-grow">{permit.description}</p>
      
      <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-slate-100 py-4">
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400">Location</p>
          <p className="text-sm font-medium text-slate-700 truncate">{permit.location}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400">Agency</p>
          <p className="text-sm font-medium text-slate-700 truncate">{permit.agency}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400">Capacity</p>
          <p className="text-sm font-medium text-indigo-700">{permit.size}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400">Fuel Type</p>
          <p className="text-sm font-medium text-slate-700">{permit.fuel}</p>
        </div>
      </div>

      {permit.sourceUrl && (
        <div className="pt-2 border-t border-slate-50">
          <a 
            href={permit.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Verify at Source
          </a>
        </div>
      )}
    </div>
  );
};
