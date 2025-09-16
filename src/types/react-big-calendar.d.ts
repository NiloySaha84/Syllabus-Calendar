declare module 'react-big-calendar' {
    import { ComponentType, CSSProperties } from 'react';
  
    export interface Event {
      id?: string | number;
      title: string;
      start: Date;
      end: Date;
      allDay?: boolean;
      resource?: any;
    }
  
    export interface CalendarProps {
      events: Event[];
      startAccessor?: string | ((event: Event) => Date);
      endAccessor?: string | ((event: Event) => Date);
      titleAccessor?: string | ((event: Event) => string);
      defaultView?: string;
      views?: any;
      localizer: any;
      style?: CSSProperties;
      className?: string;
      onView?: (view: any) => void;
      onSelectEvent?: (event: Event) => void;
      eventPropGetter?: (event: Event) => { style?: CSSProperties };
      popup?: boolean;
      showMultiDayTimes?: boolean;
      step?: number;
      messages?: Record<string, any>;
    }
  
    export const Calendar: ComponentType<CalendarProps>;
    export function momentLocalizer(moment: any): any;
    export type View = 'month' | 'week' | 'work_week' | 'day' | 'agenda';
  }