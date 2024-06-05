# Generated by Django 3.2.2 on 2024-03-04 14:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0009_auto_20240302_1037'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='acta',
            name='titulares',
        ),
        migrations.AddField(
            model_name='titular',
            name='acta',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='titulares', to='pos.acta'),
        ),
        migrations.AlterField(
            model_name='colindancia',
            name='acta',
            field=models.ForeignKey(default='20240304093954', on_delete=django.db.models.deletion.CASCADE, related_name='colindancias', to='pos.acta'),
        ),
    ]
