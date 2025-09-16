declare module 'react-big-calendar' {
  import { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface Event {
    id?: string | number;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: any;
    className?: string;
  }

  export type View = 'month' | 'week' | 'work_week' | 'day' | 'agenda';

  export interface CalendarProps {
    events: Event[];
    startAccessor?: string | ((event: Event) => Date);
    endAccessor?: string | ((event: Event) => Date);
    titleAccessor?: string | ((event: Event) => string);
    defaultView?: View;
    views?: View[] | { [key: string]: boolean | ComponentType };
    localizer: any;
    style?: CSSProperties;
    className?: string;
    onView?: (view: View) => void;
    onSelectEvent?: (event: Event) => void;
    eventPropGetter?: (event: Event) => { 
      style?: CSSProperties;
      className?: string;
    };
    popup?: boolean;
    showMultiDayTimes?: boolean;
    step?: number;
    messages?: {
      next?: string;
      previous?: string;
      today?: string;
      month?: string;
      week?: string;
      day?: string;
      agenda?: string;
      noEventsInRange?: string;
      showMore?: (total: number) => string;
      [key: string]: any;
    };
  }

  export const Calendar: ComponentType<CalendarProps>;
  export function momentLocalizer(moment: any): any;
}