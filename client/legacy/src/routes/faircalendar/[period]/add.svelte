<script context="module">
  export const preload = ({ params: { period } }) => {
    return {
      period,
    };
  };
</script>

<script>
  import { goto } from '@sapper/app';
  import { _ } from 'svelte-i18n';
  import { format } from 'date-fns';
  import { fr } from 'date-fns/locale';
  import Breadcrumb from 'components/Breadcrumb.svelte';
  import { post } from 'utils/axios';
  import { errorNormalizer } from 'normalizer/errors';
  import ServerErrors from 'components/ServerErrors.svelte';
  import H4Title from 'components/H4Title.svelte';
  import Form from '../_Form.svelte';

  export let period;

  const formatDate = (date) => {
    return format(new Date(date), 'EE dd MMMM', { locale: fr });
  };

  const startDate = period.split('_')[0];
  const endDate = period.split('_')[1];
  let title = $_('faircalendar.from_date', {
    values: { date: formatDate(startDate) },
  });
  let errors = [];
  let loading = false;

  const event = {
    startDate,
    endDate,
    type: 'mission',
    time: null,
    billable: 'true',
    summary: '',
    taskId: null,
    projectId: null,
  };

  if (startDate !== endDate) {
    title += ` ${$_('faircalendar.to_date', {
      values: { date: formatDate(endDate) },
    })}`;
  }

  const onSave = async (e) => {
    try {
      loading = true;
      await post('events', e.detail);
      goto(`/faircalendar?date=${startDate}`);
    } catch (e) {
      errors = errorNormalizer(e);
    } finally {
      loading = false;
    }
  };
</script>

<svelte:head>
  <title>{title} - {$_('app')}</title>
</svelte:head>

<Breadcrumb
  items={[{ title: $_('faircalendar.breadcrumb'), path: 'faircalendar' }, { title }]} />
<ServerErrors {errors} />
<H4Title {title} />
<Form {loading} on:save={onSave} {event} />
