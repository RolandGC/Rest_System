from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.generic import View
from .models import OrderItem, Product, Order  # Asegúrate de importar Order

class OrderItemView(View):
    def post(self, request, *args, **kwargs):
        # Lógica para crear un nuevo OrderItem
        data = request.POST
        try:
            order_id = data.get('order_id')
            product_id = data.get('product_id')
            quantity = data.get('quantity')
            
            # Obtener la orden y el producto
            order = get_object_or_404(Order, pk=order_id)  # Utiliza Order en lugar de OrderItem
            product = get_object_or_404(Product, pk=product_id)
            
            # Crear el nuevo OrderItem
            order_item = OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                subtotal=product.price * int(quantity)
            )
            
            # Devolver una respuesta JSON con los detalles del nuevo OrderItem
            return JsonResponse({'success': True, 'order_item_id': order_item.id})
        
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
