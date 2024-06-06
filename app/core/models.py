from django.db import models
from config import settings as setting
from django.contrib.auth.models import User
from core.pos.models import Product

class BaseModel(models.Model):
    user_creation = models.ForeignKey(setting.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True,
                                      related_name='%(app_label)s_%(class)s_creation')
    date_creation = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    user_updated = models.ForeignKey(setting.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True,
                                     related_name='%(app_label)s_%(class)s_updated')
    date_updated = models.DateTimeField(auto_now=True, null=True, blank=True)

    class Meta:
        abstract = True


class Table(models.Model):
    numero_mesa = models.IntegerField(unique=True, verbose_name='Número de Mesa')
    is_available = models.BooleanField(default=True, verbose_name='Disponible')
    def __str__(self):
        return f"Mesa {self.number} - {'Disponible' if self.is_available else 'Ocupada'}"
    

class Order(models.Model):
    table = models.ForeignKey(Table, on_delete=models.CASCADE, related_name='orders', null=True, blank=True)
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    waiter = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='served_orders', null=True, blank=True, verbose_name='Mesero')
    is_delivery = models.BooleanField(default=False)
    delivery_address = models.CharField(max_length=200, null=True, blank=True)
    total = models.DecimalField(max_digits=9, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pedido {'Delivery' if self.is_delivery else 'Local'} de {self.client.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE) 
    quantity = models.IntegerField(default=1)
    subtotal = models.DecimalField(max_digits=9, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.quantity}x {self.product.name} - {self.order}"

    def save(self, *args, **kwargs):
        self.subtotal = self.product.pvp * self.quantity
        super().save(*args, **kwargs)
