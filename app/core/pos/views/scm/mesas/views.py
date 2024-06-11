from django.views.generic import ListView, CreateView, UpdateView, DeleteView, FormView
from core.reports.forms import ReportForm
from core.pos.forms import SaleForm
#from core.security.mixins import PermissionMixin
from core.pos.forms import Mesa, MesaForm
from core.pos.forms import *
from django.urls import reverse_lazy
from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404
from django.template.loader import get_template
from django.contrib.auth.models import Group
from django.db.models import Q
from django.db import transaction
from weasyprint import HTML, CSS
import json
from django.shortcuts import render
from django.views.generic import View
from core.security.mixins import PermissionMixin
from core.pos.forms import SaleForm
from django.db import transaction
from core.pos.models import Company, CtasCollect, Product,Sale, Client,SaleDetail
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator




class MesasListView(ListView,FormView):
    #LISTAR MESAS
    model = Mesa
    form_class = SaleForm
    template_name = 'scm/mesas/list.html'
    context_object_name = "mesas"
    ordering = ['numero_mesa']
    #permission_required = 'view_mesas'

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
    
class PedidoMesasView(View):
    def get(self, request):
        mesas = Mesa.objects.all()
        return render(request, 'scm/mesas/pedido.html', {'mesas': mesas})


class SaleAdminCreateView(PermissionMixin, CreateView):
    model = Sale
    template_name = 'crm/sale/admin/create.html'
    form_class = SaleForm
    success_url = reverse_lazy('sale_admin_list')
    permission_required = 'add_sale'

    def validate_client(self):
        data = {'valid': True}
        try:
            mobile = self.request.POST['mobile']
            if Client.objects.filter(mobile=mobile).exists():
                data['valid'] = False   
        except:
            pass
        return JsonResponse(data)

    def get_form(self, form_class=None):
        return SaleForm()


class SaleAdminCreateView(PermissionMixin, CreateView):
    model = Sale
    template_name = 'crm/sale/admin/create.html'
    form_class = SaleForm
    success_url = reverse_lazy('sale_admin_list')
    permission_required = 'add_sale'

    def validate_client(self):
        data = {'valid': True}
        try:
            mobile = self.request.POST['mobile']
            if Client.objects.filter(mobile=mobile).exists():
                data['valid'] = False   
        except:
            pass
        return JsonResponse(data)

    def get_form(self, form_class=None):
        return SaleForm()

    def post(self, request, *args, **kwargs):
        action = request.POST.get('action')
        data = {}
        try:
            if action == 'add':
                with transaction.atomic():
                    sale = Sale()
                    sale.employee_id = request.user.id
                    sale.payment_method = request.POST['payment_method']
                    sale.payment_condition = request.POST['payment_condition']
                    sale.type_voucher = request.POST['type_voucher']
                    sale.igv = float(Company.objects.first().igv) / 100
                    sale.dscto = float(request.POST['dscto']) / 100
                    sale.save()

                    for i in json.loads(request.POST['products']):
                        prod = Product.objects.get(pk=i['id'])
                        saledetail = SaleDetail()
                        saledetail.sale_id = sale.id
                        saledetail.product_id = prod.id
                        saledetail.price = float(i['pvp'])
                        saledetail.cant = int(i['cant'])
                        saledetail.subtotal = saledetail.price * saledetail.cant
                        saledetail.dscto = float(i['dscto']) / 100
                        saledetail.total_dscto = saledetail.dscto * saledetail.subtotal
                        saledetail.total = saledetail.subtotal - saledetail.total_dscto
                        saledetail.save()
                        saledetail.product.save()

                    sale.calculate_invoice()

                    if sale.payment_condition == 'credito':
                        sale.end_credit = request.POST['end_credit']
                        sale.cash = 0.00
                        sale.change = 0.00
                        sale.save()
                        ctascollect = CtasCollect()
                        ctascollect.sale_id = sale.id
                        ctascollect.date_joined = sale.date_joined
                        ctascollect.end_date = sale.end_credit
                        ctascollect.debt = sale.total
                        ctascollect.saldo = sale.total
                        ctascollect.save()
                    elif sale.payment_condition == 'contado':
                        if sale.payment_method == 'efectivo':
                            sale.cash = float(request.POST['cash'])
                            sale.change = float(sale.cash) - sale.total
                            sale.save()
                        elif sale.payment_method == 'tarjeta_debito_credito':
                            sale.card_number = request.POST['card_number']
                            sale.titular = request.POST['titular']
                            sale.amount_debited = float(request.POST['amount_debited'])
                            sale.save()
                        elif sale.payment_method == 'efectivo_tarjeta':
                            sale.cash = float(request.POST['cash'])
                            sale.card_number = request.POST['card_number']
                            sale.titular = request.POST['titular']
                            sale.amount_debited = float(request.POST['amount_debited'])
                            sale.save()

                    data = {'id': sale.id}
            else:
                data['error'] = 'No ha ingresado una opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Notificación de eliminación'
        context['list_url'] = self.success_url
        return context
