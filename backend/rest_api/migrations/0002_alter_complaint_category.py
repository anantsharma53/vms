# Generated by Django 4.1.13 on 2025-07-19 10:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rest_api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='complaint',
            name='category',
            field=models.IntegerField(),
        ),
    ]
