<script>
  import { createEventDispatcher } from 'svelte';
  import {
    subMonths,
    addMonths,
    format,
    compareDesc,
    eachMonthOfInterval,
  } from 'date-fns';
  import { fr } from 'date-fns/locale';

  export let label = '';
  export let subMonth = 3;
  export let addMonth = 3;
  export let date = '';

  const dispatch = createEventDispatcher();
  const handleChange = () => {
    dispatch('change', date);
  };

  const periods = eachMonthOfInterval({
    start: subMonths(new Date(), subMonth),
    end: addMonths(new Date(), addMonth),
  }).sort(compareDesc);
</script>

<div class="block mt-4 text-sm">
  <label for="date" class="text-gray-700 dark:text-gray-400">{label}</label>
  <select
    id="date"
    bind:value={date}
    on:blur={handleChange}
    on:change={handleChange}
    class="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray">
    {#each periods as period}
      <option
        value={format(period, 'yyyy-MM-dd')}
        selected={date && format(period, 'yyyy-MM') === format(new Date(date), 'yyyy-MM')}>
        {format(period, 'MMMM yyyy', { locale: fr })}
      </option>
    {/each}
  </select>
</div>
