import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDataStore } from '~/stores/dataStore';
import { TransactionTemplate } from '~/models/TransactionTemplate';
import { AppTopToolbar, AppButtonListAdd, EmptyList, AppListSearch, TransactionTemplateListItem } from '~/components';
import { useList } from '~/composables/useList';
import { useToolbar } from '~/composables/useToolbar';
import { get } from 'lodash';
import { animateSwipeList } from '~/utils/AnimationUtils';

const TransactionTemplatesListPage: React.FC = () => {
  const router = useRouter();
  const dataStore = useDataStore();
  const [search, setSearch] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(true);

  const { isLoading, isFinished, isRefreshing, list, isEmpty, onAdd, onEdit, onDelete } = useList({
    title: 'Transaction templates list',
    routeList: '/transaction-templates/list',
    routeForm: '/transaction-templates/[id]',
    model: new TransactionTemplate(),
    onEvent: (event, payload) => {
      if (event === 'onPostDelete') {
        dataStore.transactionTemplateList = dataStore.transactionTemplateList.filter(item => parseInt(item.id) !== parseInt(payload.id));
      }
    },
  });

  const filteredList = list.sort((a, b) => TransactionTemplate.getDisplayName(a).localeCompare(TransactionTemplate.getDisplayName(b))).filter(item => {
    if (search.length === 0) return true;
    return TransactionTemplate.getAllNames(item).some(name => name.toLowerCase().includes(search.toLowerCase()));
  });

  const onRefresh = async () => {
    isLoading(true);
    isRefreshing(true);
    await dataStore.fetchTransactionTemplates();
    isLoading(false);
    isRefreshing(false);
    onLoadMore();
  };

  const onLoadMore = () => {
    list(dataStore.transactionTemplateList);
  };

  useEffect(() => {
    onRefresh();
  }, []);

  const toolbar = useToolbar();
  toolbar.init({
    title: 'Templates list',
    backRoute: '/extras',
  });

  animateSwipeList(list);

  return (
    <div className={`app-form ${isEmpty ? 'empty' : ''}`}>
      <AppTopToolbar>
        <AppButtonListAdd onClick={onAdd} />
      </AppTopToolbar>

      {isEmpty && <EmptyList />}

      <div className="p-1">
        {isSearchVisible && list.length > 0 && <AppListSearch value={search} onChange={setSearch} />}
        {filteredList.map(template => (
          <TransactionTemplateListItem key={template.id} value={template} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

export default TransactionTemplatesListPage;
