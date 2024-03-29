# Generated by Django 3.2.22 on 2023-11-15 13:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64)),
                ('slug', models.SlugField(unique=True)),
                ('description', models.TextField(max_length=1024)),
                ('icon', models.ImageField(blank=True, upload_to='game_icons')),
                ('score_type', models.JSONField()),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='GameTag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64)),
                ('slug', models.SlugField(unique=True)),
                ('description', models.TextField(max_length=1024)),
            ],
        ),
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64)),
                ('slug', models.SlugField(null=True, unique=True)),
                ('is_ai', models.BooleanField(default=False)),
                ('description', models.TextField(default='', max_length=1024)),
            ],
        ),
        migrations.CreateModel(
            name='PlayerTag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64)),
                ('description', models.TextField(max_length=1024)),
            ],
        ),
        migrations.CreateModel(
            name='Score',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.JSONField()),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='na.game')),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='na.player')),
            ],
        ),
        migrations.AddField(
            model_name='player',
            name='player_tags',
            field=models.ManyToManyField(to='na.PlayerTag'),
        ),
        migrations.AddField(
            model_name='player',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='game',
            name='tags',
            field=models.ManyToManyField(to='na.GameTag'),
        ),
    ]
