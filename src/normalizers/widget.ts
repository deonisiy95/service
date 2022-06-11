import {IWidget, IWidgetDoc} from 'models/widget';

export default function(widget: IWidgetDoc): IWidget {
  return {
    name: widget.name,
    token: widget.token,
    userId: widget.userId,
    widgetId: widget.widgetId,
    agents: widget.agents
  };
}
