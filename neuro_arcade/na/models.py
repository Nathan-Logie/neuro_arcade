from typing import Iterable, Optional

from django.contrib.auth.models import User
from django.db import models
from django.template.defaultfilters import slugify


MAX_SCORE_VALUE_SIZE = 256


class GameTag(models.Model):
    """Category for a game. """

    MAX_NAME_LENGTH = 64
    MAX_DESCRIPTION_LENGTH = 1024

    name = models.CharField(max_length=MAX_NAME_LENGTH)
    slug = models.SlugField(unique=True)
    description = models.TextField(max_length=MAX_DESCRIPTION_LENGTH)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(GameTag, self).save(*args, **kwargs)


class Game(models.Model):
    """Description of a game added to the website. """

    MAX_NAME_LENGTH = 64
    MAX_DESCRIPTION_LENGTH = 1024

    MEDIA_SUBDIR = 'game_icons'

    name = models.CharField(max_length=MAX_NAME_LENGTH)
    slug = models.SlugField(unique=True)
    description = models.TextField(max_length=MAX_DESCRIPTION_LENGTH)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    icon = models.ImageField(upload_to=MEDIA_SUBDIR, blank=True)
    tags = models.ManyToManyField(GameTag)
    score_type = models.CharField(max_length=MAX_SCORE_VALUE_SIZE)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Game, self).save(*args, **kwargs)

    def matches_search(self, query: Optional[str], tags: Optional[Iterable[GameTag]]) -> bool:
        accept = True

        # Check tags
        if tags is not None:
            for tag in tags:
                if not self.tags.contains(tag):
                    accept = False

        # Check query in name and description
        if query is not None:
            lower = query.lower()
            if lower not in self.name.lower() and lower not in self.description.lower():
                accept = False

        return accept


class PlayerTag(models.Model):
    """A category of Player. Mostly used for AI players. """

    MAX_NAME_LENGTH = 64
    MAX_DESCRIPTION_LENGTH = 1024

    name = models.CharField(max_length=MAX_NAME_LENGTH)
    description = models.TextField(max_length=MAX_DESCRIPTION_LENGTH)


class Player(models.Model):
    """An entity that can appear on a scoreboard, human or AI.

     Players have an `owner` user.

     The `is_ai` field decides whenever a player is a human or an AI. """

    MAX_PLAYER_NAME_LENGTH = 64
    MAX_PLAYER_DESCRIPTION_LENGTH = 1024

    name = models.CharField(max_length=MAX_PLAYER_NAME_LENGTH)
    slug = models.SlugField(unique=True, null=True)
    is_ai = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)  # todo is CASCADE right here?
    description = models.TextField(max_length=MAX_PLAYER_DESCRIPTION_LENGTH, default='')
    player_tags = models.ManyToManyField(PlayerTag)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Player, self).save(*args, **kwargs)


class ScoreType(models.Model):
    """Definition of the type of score returned by an evaluation script"""

    MAX_NAME_LENGTH = 64
    MAX_DESCRIPTION_LENGTH = 1024

    MEDIA_SUBDIR = 'evaluation_functions'

    name = models.CharField(max_length=MAX_NAME_LENGTH)
    description = models.CharField(max_length=MAX_DESCRIPTION_LENGTH)
    code = models.FileField(upload_to=MEDIA_SUBDIR)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)


class ScoreFieldType(models.Model):
    """Definition of a field of a score in an evaluation script"""

    MAX_NAME_LENGTH = 64
    MAX_DESCRIPTION_LENGTH = 1024

    group = models.ForeignKey(ScoreType, on_delete=models.CASCADE)
    name = models.CharField(max_length=MAX_NAME_LENGTH)
    description = models.CharField(max_length=MAX_DESCRIPTION_LENGTH)
    min = models.IntegerField(null=True)
    max = models.IntegerField(null=True)


class Score(models.Model):
    """A single set of values for a ScoreType"""

    group = models.ForeignKey(ScoreType, on_delete=models.CASCADE)
    time = models.DateTimeField()


class ScoreField(models.Model):
    """A single value for a ScoreFieldType in a score"""

    group = models.ForeignKey(Score, on_delete=models.CASCADE)
    type = models.ForeignKey(ScoreFieldType, on_delete=models.CASCADE)
    value = models.IntegerField()


class Publication(models.Model):

    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    link = models.URLField(max_length=255)
    about_page = models.ForeignKey('About', on_delete=models.CASCADE, related_name='publications')


class About(models.Model):

    description = models.TextField(default="Neuro Arcade Description")
    image = models.ImageField()

