# Generated by Django 3.2.2 on 2024-06-05 21:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0015_mesas'),
    ]

    operations = [
        migrations.CreateModel(
            name='Mesa',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('numero_mesa', models.IntegerField()),
                ('disponibilidad', models.BooleanField()),
            ],
        ),
        migrations.DeleteModel(
            name='Mesas',
        ),
    ]
