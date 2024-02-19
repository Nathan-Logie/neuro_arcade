from django.contrib import admin

from na.models import GameTag, Game, Player, PlayerTag, Score, RawScore

# Register your models here.

admin.site.register(GameTag)
admin.site.register(Game)
admin.site.register(Player)
admin.site.register(PlayerTag)
admin.site.register(Score)
admin.site.register(RawScore)
