from rest_framework import serializers
from na.models import Game, GameTag, Player, PlayerTag, UserStatus
from django.contrib.auth.models import User


class UserStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStatus
        fields = '__all__'


class UserSerializer(serializers.HyperlinkedModelSerializer):
    status = UserStatusSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'status']


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id','name', 'slug', 'description','owner','icon','tags', 'score_type', 'play_link', 'evaluation_script']

class GameTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameTag
        fields = ['id', 'name', 'slug', 'description']

class PlayerTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlayerTag
        fields = ['id', 'name', 'slug', 'description']

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'name', 'slug', 'is_ai', 'user', 'description', 'tags']
