from django.views.generic import ListView, CreateView, UpdateView, DeleteView, FormView, View
from core.reports.forms import ReportForm
from core.pos.forms import SaleForm
from core.security.mixins import PermissionMixin
from core.pos.forms import Mesa, MesaForm
from core.pos.forms import *
from django.urls import reverse_lazy
from django.core.serializers.json import DjangoJSONEncoder
from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404
from django.template.loader import get_template
from django.contrib.auth.models import Group
from django.db.models import Q
from django.db import transaction
from weasyprint import HTML, CSS
import json

class MesasListView(PermissionMixin,ListView,FormView):
    #LISTAR MESAS
    model = Mesa
    form_class = SaleForm
    template_name = 'scm/mesas/list.html'
    context_object_name = "mesas"
    ordering = ['numero_mesa']
    permission_required = 'view_mesa'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['create_url'] = reverse_lazy('mesa_create')
        context['frmClient'] = ClientForm()
        context['action'] = 'add'
        context['title'] = 'Listado de Mesas'
        context['igv'] = Company.objects.first().get_igv()
        return context
    
    #LISTAR MODAL
    #template_name = 'crm/sale/admin/list.html'
    #permission_required = 'view_sale'
    

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        print()
        print(action)
        try:
            if action == 'search':
                data = []
                start_date = request.POST['start_date']
                end_date = request.POST['end_date']
                search = Sale.objects.filter()
                if len(start_date) and len(end_date):
                    search = search.filter(date_joined__range=[start_date, end_date])
                for i in search:
                    data.append(i.toJSON())
            elif action == 'search_detproducts':
                data = []
                for det in SaleDetail.objects.filter(sale_id=request.POST['id']):
                    data.append(det.toJSON())
            else:
                data['error'] = 'No ha ingresado una opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')


class MesasCreateView(PermissionMixin,CreateView):
    model = Mesa
    template_name = 'scm/mesas/create.html'
    form_class = MesaForm
    success_url = reverse_lazy('mesa_list')
    permission_required = 'add_mesa'

    def validate_data(self):
        data = {'valid': True}
        try:
            type = self.request.POST['type']
            obj = self.request.POST['obj'].strip()
            if type == 'numero_mesa':
                if Mesa.objects.filter(numero_mesa__iexact=obj):
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
    
class MesasUpdateView(PermissionMixin,UpdateView):
    model = Mesa
    template_name = 'scm/mesas/create.html'
    form_class = MesaForm
    success_url = reverse_lazy('mesa_list')
    permission_required = 'change_mesa'

    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def validate_data(self):
        data = {'valid': True}
        try:
            type = self.request.POST['type']
            obj = self.request.POST['obj'].strip()
            id = self.get_object().id
            if type == 'numero_mesa':
                if Mesa.objects.filter(numero_mesa__iexact=obj).exclude(id=id):
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

    def get_object(self, queryset=None):
        id = self.kwargs.get('pk')
        return get_object_or_404(Mesa, id=id)

    def get_queryset(self):
        return Mesa.objects.all()
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['list_url'] = self.success_url
        context['title'] = 'Edición de una Categoría'
        context['action'] = 'edit'
        return context
    
class MesasDeleteView(PermissionMixin,DeleteView):
    model = Mesa
    template_name = 'scm/mesas/delete.html'
    success_url = reverse_lazy('mesa_list')
    context_object_name = "mesas"
    permission_required = 'delete_mesa'

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            self.get_object().delete()
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    # def get_context_data(self, **kwargs):
    #     context = super().get_context_data(**kwargs)
    #     context['title'] = 'Notificación de eliminación'
    #     context['list_url'] = self.success_url
    #     return context

    def get_object(self, queryset=None):
        id = self.kwargs.get('pk')
        return get_object_or_404(Mesa, id=id)

    def get_queryset(self):
        return Mesa.objects.all()
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Notificación de eliminación'
        context['list_url'] = self.success_url
        return context

class OrdersListView(PermissionMixin,FormView):
    template_name = 'scm/mesas/orders.html'
    permission_required = 'view_sale'
    form_class = ReportForm

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST.get('action')
        try:
            if action == 'search':
                data = []
                start_date = request.POST.get('start_date')
                end_date = request.POST.get('end_date')
                search = Sale.objects.all()
                if start_date and end_date:
                    search = search.filter(date_joined__range=[start_date, end_date])
                for sale in search:
                    sale_json = sale.toJSON()
                    if sale_json['mesa_numero'] != 'N/A':
                        data.append(sale_json)
            elif action == 'search_detproducts':
                data = []
                sale_id = request.POST.get('id')
                for det in SaleDetail.objects.filter(sale_id=sale_id):
                    data.append(det.toJSON())
            else:
                data['error'] = 'No ha ingresado una opción válida'
        except Exception as e:
            data['error'] = str(e)
        
        return JsonResponse(data, encoder=DjangoJSONEncoder, safe=False)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['create_url'] = reverse_lazy('mesa_list')
        context['title'] = 'Listado de Pedidos'
        return context
    
#cambiar estado entregado y cancelado    
        
class CambiarEstado(PermissionMixin,View):
    permission_required = 'view_sale'
    def post(self, request):
        data = json.loads(request.body.decode('utf-8'))
        print(data)
        sale_id = data.get('sale_id')
        action = data.get('action')
        mesa_id = data.get('mesa_id')
        try:
            sale = Sale.objects.get(pk=sale_id)
            mesa=Mesa.objects.get(pk=mesa_id)
            if action == 1:
                sale.estado_entrega = not sale.estado_entrega
            else:
                if sale.estado_entrega:
                    sale.estado_pago = not sale.estado_pago
                    mesa.disponibilidad = not mesa.disponibilidad
                    mesa.save()
            sale.save()
            return JsonResponse({'message': 'Estado del pedido cambiado exitosamente'})
        except Sale.DoesNotExist:
            return JsonResponse({'error': 'El estado de la mesa especificada no existe'}, status=404)
        except Exception as e:
            return JsonResponse({'error123': str(e)}, status=500)