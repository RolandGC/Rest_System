from django.views.generic import ListView, CreateView, UpdateView, DeleteView
#from core.security.mixins import PermissionMixin
from core.pos.forms import Mesa, MesaForm
from django.urls import reverse_lazy
from django.http import JsonResponse, HttpResponse
import json
from django.shortcuts import render
from django.views.generic import View

class MesasListView(ListView):
    model = Mesa
    template_name = 'scm/mesas/list.html'
    context_object_name = "mesas"
    #permission_required = 'view_mesas'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['create_url'] = reverse_lazy('mesa_create')
        context['title'] = 'Listado de Mesas'
        return context
    
class MesasCreateView(CreateView):
    model = Mesa
    template_name = 'scm/mesas/create.html'
    form_class = MesaForm
    success_url = reverse_lazy('mesa_list')
    #permission_required = 'add_mesas'

    def validate_data(self):
        data = {'valid': True}
        try:
            type = self.request.POST['type']
            obj = self.request.POST['obj'].strip()
            if type == 'name':
                if Mesa.objects.filter(name__iexact=obj):
                    data['valid'] = False
        except:
            pass
        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'add':
                data = self.get_form().save()
            elif action == 'validate_data':
                return self.validate_data()
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['list_url'] = self.success_url
        context['title'] = 'Nuevo registro de una Mesa'
        context['action'] = 'add'
        return context
    
class MesasUpdateView(UpdateView):
    model = Mesa
    template_name = 'scm/mesas/create.html'
    form_class = MesaForm
    success_url = reverse_lazy('mesa_list')
    #permission_required = 'change_mesas'

    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def validate_data(self):
        data = {'valid': True}
        try:
            type = self.request.POST['type']
            obj = self.request.POST['obj'].strip()
            id = self.get_object().id
            if type == 'name':
                if Mesa.objects.filter(name__iexact=obj).exclude(id=id):
                    data['valid'] = False
        except:
            pass
        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'edit':
                data = self.get_form().save()
            elif action == 'validate_data':
                return self.validate_data()
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['list_url'] = self.success_url
        context['title'] = 'Edición de una Categoría'
        context['action'] = 'edit'
        return context
    
class MesasDeleteView(DeleteView):
    model = Mesa
    template_name = 'scm/mesas/delete.html'
    success_url = reverse_lazy('mesa_list')
    context_object_name = "mesas"
    #permission_required = 'delete_mesas'

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            self.get_object().delete()
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Notificación de eliminación'
        context['list_url'] = self.success_url
        return context
    
class PedidoMesasView(View):
    def get(self, request):
        mesas = Mesa.objects.all()
        return render(request, 'scm/mesas/pedido.html', {'mesas': mesas})
